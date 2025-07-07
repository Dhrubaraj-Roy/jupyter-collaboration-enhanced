// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/**
 * @packageDocumentation
 * @module readonly-collaboration
 */
/**
 * Utility class to handle read-only mode functionality
 */
export class ReadOnlyManager {
    constructor(app) {
        this._app = app;
        this._config = this._parseURLParameters();
        // Initialize read-only mode
        if (this._config.readonly) {
            this._setupReadOnlyMode();
        }
    }
    /**
     * Get the current read-only configuration
     */
    get config() {
        return this._config;
    }
    /**
     * Check if the current session is in read-only mode
     */
    get isReadOnly() {
        return this._config.readonly;
    }
    /**
     * Parse URL parameters to determine read-only status and username
     */
    _parseURLParameters() {
        var _a;
        const url = new URL(window.location.href);
        const searchParams = url.searchParams;
        const readonly = ((_a = searchParams.get('readonly')) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'true';
        const username = searchParams.get('username') || 'Anonymous';
        console.log('ReadOnlyManager: URL:', url.href);
        console.log('ReadOnlyManager: username param:', searchParams.get('username'));
        console.log('ReadOnlyManager: readonly param:', searchParams.get('readonly'));
        console.log(`ReadOnlyManager: Parsed - readonly: ${readonly}, username: ${username}`);
        return { readonly, username };
    }
    /**
     * Setup read-only mode for the application
     */
    _setupReadOnlyMode() {
        console.log('Setting up read-only mode...');
        // Add read-only indicator to the page
        this._addReadOnlyIndicator();
        // Monitor for new documents
        this._app.restored.then(() => {
            this._makeExistingDocumentsReadOnly();
            this._setupDocumentMonitoring();
        });
    }
    /**
     * Make existing documents read-only
     */
    _makeExistingDocumentsReadOnly() {
        const widgets = Array.from(this._app.shell.widgets('main'));
        widgets.forEach((widget) => {
            if (this._isDocumentWidget(widget)) {
                this._makeDocumentReadOnly(widget);
            }
        });
    }
    /**
     * Setup monitoring for new documents
     */
    _setupDocumentMonitoring() {
        // Use a timer to periodically check for new documents
        setInterval(() => {
            const widgets = Array.from(this._app.shell.widgets('main'));
            widgets.forEach((widget) => {
                if (this._isDocumentWidget(widget) && !widget.node.classList.contains('jp-mod-readonly-processed')) {
                    this._makeDocumentReadOnly(widget);
                    widget.node.classList.add('jp-mod-readonly-processed');
                }
            });
        }, 1000);
    }
    /**
     * Add a visual indicator that the session is in read-only mode
     */
    _addReadOnlyIndicator() {
        // Create popup notification
        this._showReadOnlyPopup();
        // Add a subtle indicator in the top bar
        this._addTopBarIndicator();
    }
    /**
     * Show a temporary popup notification
     */
    _showReadOnlyPopup() {
        const popup = document.createElement('div');
        popup.id = 'readonly-popup';
        popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #ff6b6b;
      color: white;
      padding: 20px 30px;
      border-radius: 8px;
      font-family: var(--jp-ui-font-family);
      font-size: 16px;
      font-weight: bold;
      z-index: 10001;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease-out;
    `;
        popup.innerHTML = `
      <div style="text-align: center;">
        <div style="font-size: 18px; margin-bottom: 8px;">🔒 READ-ONLY MODE</div>
        <div style="font-size: 14px; opacity: 0.9;">Viewing as: ${this._config.username}</div>
        <div style="font-size: 12px; margin-top: 8px; opacity: 0.8;">This popup will close automatically</div>
      </div>
    `;
        // Add animation CSS
        const style = document.createElement('style');
        style.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.8);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
      }
      @keyframes slideOut {
        from {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
        to {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.8);
        }
      }
    `;
        document.head.appendChild(style);
        document.body.appendChild(popup);
        // Auto-remove popup after 4 seconds
        setTimeout(() => {
            popup.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, 300);
        }, 4000);
    }
    /**
     * Add a subtle indicator to the top bar
     */
    _addTopBarIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'readonly-topbar-indicator';
        indicator.style.cssText = `
      position: fixed;
      top: 2px;
      right: 2px;
      background: rgba(255, 107, 107, 0.7);
      color: white;
      padding: 2px 6px;
      border-radius: 8px;
      font-family: var(--jp-ui-font-family);
      font-size: 8px;
      font-weight: normal;
      z-index: 9999;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: all 0.2s ease;
      opacity: 0.6;
    `;
        indicator.textContent = `🔒`;
        // Show full info on hover
        indicator.addEventListener('mouseenter', () => {
            indicator.style.background = '#ff6b6b';
            indicator.style.opacity = '1';
            indicator.style.padding = '4px 8px';
            indicator.style.fontSize = '10px';
            indicator.textContent = `🔒 READ-ONLY (${this._config.username})`;
        });
        indicator.addEventListener('mouseleave', () => {
            indicator.style.background = 'rgba(255, 107, 107, 0.7)';
            indicator.style.opacity = '0.6';
            indicator.style.padding = '2px 6px';
            indicator.style.fontSize = '8px';
            indicator.textContent = `🔒`;
        });
        document.body.appendChild(indicator);
    }
    /**
     * Check if a widget is a document widget
     */
    _isDocumentWidget(widget) {
        return widget &&
            widget.context &&
            widget.context.model;
    }
    /**
     * Make a document widget read-only
     */
    _makeDocumentReadOnly(widget) {
        console.log(`Making document read-only: ${widget.context.path}`);
        // Set the model to read-only
        if (widget.context.model) {
            widget.context.model.readOnly = true;
        }
        // Check if it's a notebook widget
        if (widget.context.path.endsWith('.ipynb')) {
            this._makeNotebookReadOnly(widget);
        }
        else {
            // For other file types, treat as file editor
            this._makeFileEditorReadOnly(widget);
        }
        // Add visual indication to the widget
        this._addReadOnlyStyleToWidget(widget);
    }
    /**
     * Make a notebook widget read-only
     */
    _makeNotebookReadOnly(widget) {
        const notebook = widget.content;
        if (notebook && notebook.model) {
            // Disable cell editing
            notebook.model.readOnly = true;
            // Add readonly class for styling
            notebook.node.classList.add('jp-mod-readonly');
            // Disable toolbar actions
            const toolbar = widget.toolbar;
            if (toolbar) {
                toolbar.node.style.pointerEvents = 'none';
                toolbar.node.style.opacity = '0.6';
            }
            // Monitor for new cells and make them read-only
            if (notebook.model.cells) {
                notebook.model.cells.changed.connect(() => {
                    this._makeAllCellsReadOnly(notebook.model.cells);
                });
                // Make existing cells read-only
                this._makeAllCellsReadOnly(notebook.model.cells);
            }
            // Disable the notebook panel itself
            if (notebook.node) {
                notebook.node.style.pointerEvents = 'none';
                notebook.node.style.userSelect = 'none';
            }
        }
    }
    /**
     * Make all cells in a cell list read-only
     */
    _makeAllCellsReadOnly(cells) {
        if (!cells)
            return;
        // Handle different cell list types
        if (typeof cells.length === 'number') {
            // Array-like interface
            for (let i = 0; i < cells.length; i++) {
                const cell = cells.get ? cells.get(i) : cells[i];
                if (cell) {
                    cell.readOnly = true;
                }
            }
        }
        else if (cells.iter) {
            // Iterator interface
            const iter = cells.iter();
            let cell = iter.next();
            while (cell) {
                cell.readOnly = true;
                cell = iter.next();
            }
        }
    }
    /**
     * Make a file editor widget read-only
     */
    _makeFileEditorReadOnly(widget) {
        const editor = widget.content;
        if (editor && editor.editor) {
            // Disable the editor
            editor.editor.setOption('readOnly', true);
            // Add readonly class for styling
            editor.node.classList.add('jp-mod-readonly');
        }
    }
    /**
     * Add read-only styling to a widget
     */
    _addReadOnlyStyleToWidget(widget) {
        const style = document.createElement('style');
        style.textContent = `
      .jp-mod-readonly {
        position: relative;
      }
      
      .jp-mod-readonly .jp-Cell {
        opacity: 0.9;
      }
      
      .jp-mod-readonly .jp-InputArea-editor {
        cursor: not-allowed !important;
        user-select: none !important;
        background-color: #f8f9fa !important;
      }
      
      .jp-mod-readonly .jp-Cell-inputArea {
        background-color: #f8f9fa !important;
      }
      
      .jp-mod-readonly .jp-CodeCell-inputCollapser,
      .jp-mod-readonly .jp-Cell-inputCollapser {
        pointer-events: none !important;
        opacity: 0.5;
      }
    `;
        document.head.appendChild(style);
        widget.node.classList.add('jp-mod-readonly');
    }
    /**
     * Static method to initialize read-only manager
     */
    static initialize(app) {
        return new ReadOnlyManager(app);
    }
}
/**
 * Utility function to check if read-only mode is enabled from URL
 */
export function isReadOnlyMode() {
    var _a;
    const url = new URL(window.location.href);
    return ((_a = url.searchParams.get('readonly')) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === 'true';
}
/**
 * Utility function to get username from URL
 */
export function getUsernameFromURL() {
    const url = new URL(window.location.href);
    return url.searchParams.get('username') || 'Anonymous';
}
//# sourceMappingURL=readonly.js.map