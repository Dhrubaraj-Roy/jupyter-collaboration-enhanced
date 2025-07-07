// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/**
 * @packageDocumentation
 * @module userinfo-collaboration
 */

import { JupyterFrontEnd } from '@jupyterlab/application';

/**
 * Interface for user configuration from URL
 */
export interface IUserConfig {
  username: string;
  displayName: string;
  initials: string;
  readonly: boolean;
}

/**
 * Utility class to handle user information from URL parameters
 */
export class UserInfoManager {
  private _config: IUserConfig;
  private _app: JupyterFrontEnd;

  constructor(app: JupyterFrontEnd) {
    this._app = app;
    this._config = this._parseURLParameters();
    
    // Set user information in the service manager
    this._setupUserInfo();
  }

  /**
   * Get the current user configuration
   */
  get config(): IUserConfig {
    return this._config;
  }

  /**
   * Parse URL parameters to extract user information
   */
  private _parseURLParameters(): IUserConfig {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;
    
    const username = searchParams.get('username') || 'Anonymous';
    const readonly = searchParams.get('readonly')?.toLowerCase() === 'true';
    
    // Generate display name and initials
    const displayName = username;
    const initials = this._generateInitials(username);

    console.log(`UserInfoManager - Username: ${username}, Display: ${displayName}, Initials: ${initials}, ReadOnly: ${readonly}`);
    
    return { 
      username, 
      displayName, 
      initials, 
      readonly 
    };
  }

  /**
   * Generate initials from username
   */
  private _generateInitials(username: string): string {
    if (!username || username === 'Anonymous') {
      return 'AN';
    }
    
    // Split by common separators and take first letter of each part
    const parts = username.split(/[\s_-]+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    
    // For single word, take first two letters
    return username.substring(0, 2).toUpperCase();
  }

  /**
   * Generate a color for the user based on their username
   */
  private _generateUserColor(username: string): string {
    // Simple hash function to generate consistent colors
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      const char = username.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert hash to HSL color with good saturation and lightness
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  }

  /**
   * Setup user information in JupyterLab's user service
   */
  private _setupUserInfo(): void {
    const { user } = this._app.serviceManager;
    
    console.log('UserInfoManager: Setting up user info...', this._config);
    
    // Create user identity object
    const userIdentity = {
      username: this._config.username,
      name: this._config.displayName,
      display_name: this._config.displayName,
      initials: this._config.initials,
      avatar_url: '',
      color: this._generateUserColor(this._config.username)
    };

    // Set user identity immediately
    this._setUserIdentity(user, userIdentity);

    // Also set it when the user service is ready
    user.ready.then(() => {
      console.log('UserInfoManager: User service ready, updating identity...');
      this._setUserIdentity(user, userIdentity);
    }).catch(error => {
      console.error('UserInfoManager: Failed to setup user info on ready:', error);
    });

    // Set it after a delay to ensure all services are loaded
    setTimeout(() => {
      console.log('UserInfoManager: Delayed update of user identity...');
      this._setUserIdentity(user, userIdentity);
    }, 1000);
  }

  /**
   * Set user identity on the user service
   */
  private _setUserIdentity(user: any, userIdentity: any): void {
    try {
      console.log('UserInfoManager: Setting user identity:', userIdentity);
      
      // Method 1: Set on internal identity if writable
      if (user._identity !== undefined) {
        try {
          user._identity = userIdentity;
        } catch (e) {
          console.log('UserInfoManager: _identity is read-only');
        }
      }
      
      // Method 2: Set on the internal user object
      if (user._user) {
        Object.assign(user._user, userIdentity);
      }
      
      // Method 3: Use patch method if available
      if (typeof user.patch === 'function') {
        user.patch(userIdentity);
      }
      
      // Method 4: Try setting individual properties if they're writable
      try {
        if (user.username !== undefined) {
          user.username = userIdentity.username;
        }
        if (user.name !== undefined) {
          user.name = userIdentity.name;
        }
        if (user.display_name !== undefined) {
          user.display_name = userIdentity.display_name;
        }
        if (user.initials !== undefined) {
          user.initials = userIdentity.initials;
        }
        if (user.color !== undefined) {
          user.color = userIdentity.color;
        }
      } catch (e) {
        console.log('UserInfoManager: Some properties are read-only');
      }
      
      // Emit the user changed signal
      if (user._userChanged && typeof user._userChanged.emit === 'function') {
        user._userChanged.emit(userIdentity);
      }
      
      // Try the userChanged signal as well
      if (user.userChanged && typeof user.userChanged.emit === 'function') {
        user.userChanged.emit(userIdentity);
      }
      
      console.log('UserInfoManager: User identity set successfully');
      
    } catch (error) {
      console.error('UserInfoManager: Error setting user identity:', error);
    }
  }

  /**
   * Static method to initialize user info manager
   */
  static initialize(app: JupyterFrontEnd): UserInfoManager {
    return new UserInfoManager(app);
  }
}

/**
 * Utility function to get user configuration from URL
 */
export function getUserConfigFromURL(): IUserConfig {
  const url = new URL(window.location.href);
  const searchParams = url.searchParams;
  
  const username = searchParams.get('username') || 'Anonymous';
  const readonly = searchParams.get('readonly')?.toLowerCase() === 'true';
  
  return {
    username,
    displayName: username,
    initials: username.substring(0, 2).toUpperCase(),
    readonly
  };
} 