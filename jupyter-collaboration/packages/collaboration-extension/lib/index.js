// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
/**
 * @packageDocumentation
 * @module collaboration-extension
 */
import { userMenuPlugin, menuBarPlugin, rtcGlobalAwarenessPlugin, rtcPanelPlugin, userEditorCursors, readOnlyPlugin, userInfoPlugin
// Temporarily disabled: liveCodeReviewPlugin,
// Temporarily disabled: peerReviewPlugin
 } from './collaboration';
import { sharedLink } from './sharedlink';
/**
 * Export the plugins as default.
 */
const plugins = [
    userMenuPlugin,
    menuBarPlugin,
    rtcGlobalAwarenessPlugin,
    rtcPanelPlugin,
    sharedLink,
    userEditorCursors,
    readOnlyPlugin,
    userInfoPlugin
    // Temporarily disabled: liveCodeReviewPlugin,
    // Temporarily disabled: peerReviewPlugin
];
export default plugins;
//# sourceMappingURL=index.js.map