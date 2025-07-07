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
export declare class UserInfoManager {
    private _config;
    private _app;
    constructor(app: JupyterFrontEnd);
    /**
     * Get the current user configuration
     */
    get config(): IUserConfig;
    /**
     * Parse URL parameters to extract user information
     */
    private _parseURLParameters;
    /**
     * Generate initials from username
     */
    private _generateInitials;
    /**
     * Generate a color for the user based on their username
     */
    private _generateUserColor;
    /**
     * Setup user information in JupyterLab's user service
     */
    private _setupUserInfo;
    /**
     * Set user identity on the user service
     */
    private _setUserIdentity;
    /**
     * Static method to initialize user info manager
     */
    static initialize(app: JupyterFrontEnd): UserInfoManager;
}
/**
 * Utility function to get user configuration from URL
 */
export declare function getUserConfigFromURL(): IUserConfig;
