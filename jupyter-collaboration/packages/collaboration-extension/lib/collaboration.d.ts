/**
 * @packageDocumentation
 * @module collaboration-extension
 */
import { JupyterFrontEndPlugin } from '@jupyterlab/application';
import { IAwareness } from '@jupyter/ydoc';
import { IUserMenu } from '@jupyter/collaboration';
/**
 * Jupyter plugin providing the IUserMenu.
 */
export declare const userMenuPlugin: JupyterFrontEndPlugin<IUserMenu>;
/**
 * Jupyter plugin adding the IUserMenu to the menu bar if collaborative flag enabled.
 */
export declare const menuBarPlugin: JupyterFrontEndPlugin<void>;
/**
 * Jupyter plugin creating a global awareness for RTC.
 */
export declare const rtcGlobalAwarenessPlugin: JupyterFrontEndPlugin<IAwareness>;
/**
 * Jupyter plugin adding the RTC information to the application left panel if collaborative flag enabled.
 */
export declare const rtcPanelPlugin: JupyterFrontEndPlugin<void>;
export declare const userEditorCursors: JupyterFrontEndPlugin<void>;
/**
 * Jupyter plugin for read-only mode functionality.
 */
export declare const readOnlyPlugin: JupyterFrontEndPlugin<void>;
/**
 * Jupyter plugin for user info management from URL parameters.
 */
export declare const userInfoPlugin: JupyterFrontEndPlugin<void>;
/**
 * Jupyter plugin for live code review and annotations.
 */
export declare const liveCodeReviewPlugin: JupyterFrontEndPlugin<void>;
/**
 * Jupyter plugin for peer review workflow.
 */
export declare const peerReviewPlugin: JupyterFrontEndPlugin<void>;
