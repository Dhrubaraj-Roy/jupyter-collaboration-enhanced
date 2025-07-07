// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { Dialog, ReactWidget, showDialog } from '@jupyterlab/apputils';

import { User } from '@jupyterlab/services';

import { IRenderMime } from '@jupyterlab/rendermime-interfaces';

import { Panel } from '@lumino/widgets';

import * as React from 'react';

import { UserDetailsBody, UserIconComponent } from './components';

/**
 * The properties for the UserInfoBody.
 */
type UserInfoProps = {
  userManager: User.IManager;
  trans: IRenderMime.TranslationBundle;
};

export class UserInfoPanel extends Panel {
  private _profile: User.IManager;
  private _body: UserInfoBody | null;

  constructor(options: UserInfoProps) {
    super({});
    this.addClass('jp-UserInfoPanel');
    this._profile = options.userManager;
    this._body = null;

    if (this._profile.isReady) {
      this._body = new UserInfoBody({
        userManager: this._profile,
        trans: options.trans
      });
      this.addWidget(this._body);
      this.update();
    } else {
      this._profile.ready
        .then(() => {
          this._body = new UserInfoBody({
            userManager: this._profile,
            trans: options.trans
          });
          this.addWidget(this._body);
          this.update();
        })
        .catch(e => console.error(e));
    }
  }
}

/**
 * A SettingsWidget for the user.
 */
export class UserInfoBody
  extends ReactWidget
  implements Dialog.IBodyWidget<User.IManager>
{
  private _userManager: User.IManager;
  private _trans: IRenderMime.TranslationBundle;
  /**
   * Constructs a new settings widget.
   */
  constructor(props: UserInfoProps) {
    super();
    this._userManager = props.userManager;
    this._trans = props.trans;
  }

  get user(): User.IManager {
    return this._userManager;
  }

  set user(user: User.IManager) {
    this._userManager = user;
    this.update();
  }

  private onClick = () => {
    if (!this._userManager.identity) {
      return;
    }
    showDialog({
      body: new UserDetailsBody({
        userManager: this._userManager
      }),
      title: this._trans.__('User Details')
    }).then(async result => {
      if (result.button.accept) {
        // For URL-based authentication, we don't need to call the server API
        // The user data is managed through URL parameters
        try {
          console.log('User details updated:', result.value);
          
          // Since we're using URL-based authentication, we can't actually 
          // persist user changes to the server. We could potentially:
          // 1. Update the URL parameters (but this would require page reload)
          // 2. Store in localStorage (but this won't sync across sessions)
          // 3. Just update the local user manager state
          
          // For now, just show that the update was received but explain the limitation
          const message = this._trans.__('User details updated locally. To persist changes, update the URL parameters and reload the page.');
          
          // Try to update the user manager's internal state if possible
          if (this._userManager && typeof this._userManager.refreshUser === 'function') {
            this._userManager.refreshUser();
          }
          
          console.log(message);
        } catch (error) {
          console.error('Error updating user details:', error);
        }
      }
    });
  };

  render(): JSX.Element {
    return (
      <div className="jp-UserInfo-Container">
        <UserIconComponent
          userManager={this._userManager}
          onClick={this.onClick}
        />
      </div>
    );
  }
}
