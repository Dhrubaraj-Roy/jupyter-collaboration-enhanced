/**
 * @packageDocumentation
 * @module readonly-collaboration
 */
import { JupyterFrontEnd } from '@jupyterlab/application';
/**
 * Interface for read-only configuration
 */
export interface IReadOnlyConfig {
    readonly: boolean;
    username: string;
}
/**
 * Utility class to handle read-only mode functionality
 */
export declare class ReadOnlyManager {
    private _config;
    private _app;
    constructor(app: JupyterFrontEnd);
    /**
     * Get the current read-only configuration
     */
    get config(): IReadOnlyConfig;
    /**
     * Check if the current session is in read-only mode
     */
    get isReadOnly(): boolean;
    /**
     * Parse URL parameters to determine read-only status and username
     */
    private _parseURLParameters;
    /**
     * Setup read-only mode for the application
     */
    private _setupReadOnlyMode;
    /**
     * Make existing documents read-only
     */
    private _makeExistingDocumentsReadOnly;
    /**
     * Setup monitoring for new documents
     */
    private _setupDocumentMonitoring;
    /**
     * Add a visual indicator that the session is in read-only mode
     */
    private _addReadOnlyIndicator;
    /**
     * Show a temporary popup notification
     */
    private _showReadOnlyPopup;
    /**
     * Add a subtle indicator to the top bar
     */
    private _addTopBarIndicator;
    /**
     * Check if a widget is a document widget
     */
    private _isDocumentWidget;
    /**
     * Make a document widget read-only
     */
    private _makeDocumentReadOnly;
    /**
     * Make a notebook widget read-only
     */
    private _makeNotebookReadOnly;
    /**
     * Make all cells in a cell list read-only
     */
    private _makeAllCellsReadOnly;
    /**
     * Make a file editor widget read-only
     */
    private _makeFileEditorReadOnly;
    /**
     * Add read-only styling to a widget
     */
    private _addReadOnlyStyleToWidget;
    /**
     * Static method to initialize read-only manager
     */
    static initialize(app: JupyterFrontEnd): ReadOnlyManager;
}
/**
 * Utility function to check if read-only mode is enabled from URL
 */
export declare function isReadOnlyMode(): boolean;
/**
 * Utility function to get username from URL
 */
export declare function getUsernameFromURL(): string;
