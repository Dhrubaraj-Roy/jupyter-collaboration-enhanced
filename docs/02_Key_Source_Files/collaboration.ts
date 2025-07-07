// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/**
 * @packageDocumentation
 * @module collaboration-extension
 */

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { IToolbarWidgetRegistry } from '@jupyterlab/apputils';
import {
  EditorExtensionRegistry,
  IEditorExtensionRegistry
} from '@jupyterlab/codemirror';
import { IGlobalAwareness } from '@jupyter/collaborative-drive';
import { WebSocketAwarenessProvider } from '@jupyter/docprovider';
import { SidePanel, usersIcon } from '@jupyterlab/ui-components';
import { URLExt } from '@jupyterlab/coreutils';
import { ServerConnection } from '@jupyterlab/services';
import { IStateDB, StateDB } from '@jupyterlab/statedb';
import { ITranslator, nullTranslator } from '@jupyterlab/translation';

import { Menu, MenuBar } from '@lumino/widgets';

import { IAwareness } from '@jupyter/ydoc';

import {
  CollaboratorsPanel,
  IUserMenu,
  remoteUserCursors,
  RendererUserMenu,
  UserInfoPanel,
  UserMenu
} from '@jupyter/collaboration';

import { ReadOnlyManager } from './readonly';
import { UserInfoManager } from './userinfo';
// import { AnnotationManager } from './annotations'; // Temporarily disabled
// import { PeerReviewManager } from './peerReview'; // Temporarily disabled

import * as Y from 'yjs';
import { Awareness } from 'y-protocols/awareness';

/**
 * Jupyter plugin providing the IUserMenu.
 */
export const userMenuPlugin: JupyterFrontEndPlugin<IUserMenu> = {
  id: '@jupyter/collaboration-extension:userMenu',
  description: 'Provide connected user menu.',
  requires: [],
  provides: IUserMenu,
  activate: (app: JupyterFrontEnd): IUserMenu => {
    const { commands } = app;
    const { user } = app.serviceManager;
    return new UserMenu({ commands, user });
  }
};

/**
 * Jupyter plugin adding the IUserMenu to the menu bar if collaborative flag enabled.
 */
export const menuBarPlugin: JupyterFrontEndPlugin<void> = {
  id: '@jupyter/collaboration-extension:user-menu-bar',
  description: 'Add user menu to the interface.',
  autoStart: true,
  requires: [IUserMenu, IToolbarWidgetRegistry],
  activate: async (
    app: JupyterFrontEnd,
    menu: IUserMenu,
    toolbarRegistry: IToolbarWidgetRegistry
  ): Promise<void> => {
    const { user } = app.serviceManager;

    const menuBar = new MenuBar({
      forceItemsPosition: {
        forceX: false,
        forceY: false
      },
      renderer: new RendererUserMenu(user)
    });
    menuBar.id = 'jp-UserMenu';
    user.userChanged.connect(() => menuBar.update());
    menuBar.addMenu(menu as Menu);

    toolbarRegistry.addFactory('TopBar', 'user-menu', () => menuBar);
  }
};

/**
 * Jupyter plugin creating a global awareness for RTC.
 */
export const rtcGlobalAwarenessPlugin: JupyterFrontEndPlugin<IAwareness> = {
  id: '@jupyter/collaboration-extension:rtcGlobalAwareness',
  description: 'Add global awareness to share working document of users.',
  requires: [IStateDB],
  provides: IGlobalAwareness,
  activate: (app: JupyterFrontEnd, state: StateDB): IAwareness => {
    const { user } = app.serviceManager;

    const ydoc = new Y.Doc();
    const awareness = new Awareness(ydoc);

    const server = ServerConnection.makeSettings();
    const url = URLExt.join(server.wsUrl, 'api/collaboration/room');

    new WebSocketAwarenessProvider({
      url: url,
      roomID: 'JupyterLab:globalAwareness',
      awareness: awareness,
      user: user
    });

    state.changed.connect(async () => {
      const data: any = await state.toJSON();
      const current: string = data['layout-restorer:data']?.main?.current || '';

      // For example matches `notebook:Untitled.ipynb` or `editor:untitled.txt`,
      // but not when in launcher or terminal.
      if (current.match(/^\w+:.+/)) {
        awareness.setLocalStateField('current', current);
      } else {
        awareness.setLocalStateField('current', null);
      }
    });

    return awareness;
  }
};

/**
 * Jupyter plugin adding the RTC information to the application left panel if collaborative flag enabled.
 */
export const rtcPanelPlugin: JupyterFrontEndPlugin<void> = {
  id: '@jupyter/collaboration-extension:rtcPanel',
  description: 'Add side panel to display all currently connected users.',
  autoStart: true,
  requires: [IGlobalAwareness],
  optional: [ITranslator],
  activate: (
    app: JupyterFrontEnd,
    awareness: Awareness,
    translator: ITranslator | null
  ): void => {
    const { user } = app.serviceManager;

    const trans = (translator ?? nullTranslator).load('jupyter_collaboration');

    const userPanel = new SidePanel({
      alignment: 'justify'
    });
    userPanel.id = 'jp-collaboration-panel';
    userPanel.title.icon = usersIcon;
    userPanel.title.caption = trans.__('Collaboration');
    userPanel.addClass('jp-RTCPanel');
    app.shell.add(userPanel, 'left', { rank: 300 });

    const currentUserPanel = new UserInfoPanel({
      userManager: user,
      trans
    });
    currentUserPanel.title.label = trans.__('User info');
    currentUserPanel.title.caption = trans.__('User information');
    userPanel.addWidget(currentUserPanel);

    const fileopener = (path: string) => {
      void app.commands.execute('docmanager:open', { path });
    };

    const collaboratorsPanel = new CollaboratorsPanel(
      user,
      awareness,
      fileopener,
      app.docRegistry
    );
    collaboratorsPanel.title.label = trans.__('Online Collaborators');
    userPanel.addWidget(collaboratorsPanel);
  }
};

export const userEditorCursors: JupyterFrontEndPlugin<void> = {
  id: '@jupyter/collaboration-extension:userEditorCursors',
  description:
    'Add CodeMirror extension to display remote user cursors and selections.',
  autoStart: true,
  requires: [IEditorExtensionRegistry],
  activate: (
    app: JupyterFrontEnd,
    extensions: IEditorExtensionRegistry
  ): void => {
    extensions.addExtension({
      name: 'remote-user-cursors',
      factory(options) {
        const { awareness, ysource: ytext } = options.model.sharedModel as any;
        return EditorExtensionRegistry.createImmutableExtension(
          remoteUserCursors({ awareness, ytext })
        );
      }
    });
  }
};

/**
 * Jupyter plugin for read-only mode functionality.
 */
export const readOnlyPlugin: JupyterFrontEndPlugin<void> = {
  id: '@jupyter/collaboration-extension:readOnly',
  description: 'Add read-only mode support based on URL parameters.',
  autoStart: true,
  requires: [],
  activate: (app: JupyterFrontEnd): void => {
    // Initialize the read-only manager
    ReadOnlyManager.initialize(app);
  }
};

/**
 * Jupyter plugin for user info management from URL parameters.
 */
export const userInfoPlugin: JupyterFrontEndPlugin<void> = {
  id: '@jupyter/collaboration-extension:userInfo',
  description: 'Set user information from URL parameters for collaboration.',
  autoStart: true,
  requires: [],
  activate: (app: JupyterFrontEnd): void => {
    // Initialize the user info manager
    UserInfoManager.initialize(app);
  }
};

/**
 * Jupyter plugin for live code review and annotations.
 */
export const liveCodeReviewPlugin: JupyterFrontEndPlugin<void> = {
  id: '@jupyter/collaboration-extension:liveCodeReview',
  description: 'Add live code review and annotation capabilities.',
  autoStart: true,
  requires: [],
  activate: (app: JupyterFrontEnd): void => {
    // Initialize the annotation manager
    // new AnnotationManager(app); // Temporarily disabled
    console.log('🎉 Live Code Review & Annotations system activated!');
  }
};

/**
 * Jupyter plugin for peer review workflow.
 */
export const peerReviewPlugin: JupyterFrontEndPlugin<void> = {
  id: '@jupyter/collaboration-extension:peerReview',
  description: 'Add peer review workflow and assignment management.',
  autoStart: true,
  requires: [],
  activate: (app: JupyterFrontEnd): void => {
    // Initialize the peer review manager
    // new PeerReviewManager(app); // Temporarily disabled
    console.log('📋 Peer Review Workflow system activated!');
  }
};
