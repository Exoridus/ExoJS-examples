/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

const css = ".button_e3169063 {\n  height: 48px;\n  padding: 6px 4px;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  background: rgba(0, 0, 0, 0);\n  border: 0 none;\n  display: inline-block;\n  outline: none;\n  cursor: pointer;\n  text-decoration: none;\n  position: absolute;\n  right: 0;\n  top: 0; }\n  .button_e3169063:hover .buttonContent_e3169063, .button_e3169063:focus .buttonContent_e3169063 {\n    background-color: rgba(255, 255, 255, 0.12); }\n  .button_e3169063:active .buttonContent_e3169063 {\n    background-color: rgba(204, 204, 204, 0.25); }\n\n.buttonContent_e3169063 {\n  transition: background-color 0.3s linear;\n  height: 36px;\n  min-width: 64px;\n  line-height: 36px;\n  padding: 0 8px;\n  letter-spacing: 0.5px;\n  border-radius: 2px;\n  display: block;\n  text-transform: uppercase;\n  text-align: center;\n  font-weight: 500;\n  position: relative;\n  border: 0 none;\n  outline: none;\n  background-color: rgba(0, 0, 0, 0);\n  color: #FFFF00; }\n";
const modules_79b43374 = {"button":"button_e3169063","buttonContent":"buttonContent_e3169063"};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * True if the custom elements polyfill is in use.
 */
const isCEPolyfill = typeof window !== 'undefined' &&
    window.customElements != null &&
    window.customElements.polyfillWrapFlushCallback !==
        undefined;
/**
 * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
 * `container`.
 */
const removeNodes = (container, start, end = null) => {
    while (start !== end) {
        const n = start.nextSibling;
        container.removeChild(start);
        start = n;
    }
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */
const nodeMarker = `<!--${marker}-->`;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * Suffix appended to all bound attribute names.
 */
const boundAttributeSuffix = '$lit$';
/**
 * An updatable Template that tracks the location of dynamic parts.
 */
class Template {
    constructor(result, element) {
        this.parts = [];
        this.element = element;
        const nodesToRemove = [];
        const stack = [];
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(element.content, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
        // Keeps track of the last index associated with a part. We try to delete
        // unnecessary nodes, but we never want to associate two different parts
        // to the same index. They must have a constant node between.
        let lastPartIndex = 0;
        let index = -1;
        let partIndex = 0;
        const { strings, values: { length } } = result;
        while (partIndex < length) {
            const node = walker.nextNode();
            if (node === null) {
                // We've exhausted the content inside a nested template element.
                // Because we still have parts (the outer for-loop), we know:
                // - There is a template in the stack
                // - The walker will find a nextNode outside the template
                walker.currentNode = stack.pop();
                continue;
            }
            index++;
            if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                if (node.hasAttributes()) {
                    const attributes = node.attributes;
                    const { length } = attributes;
                    // Per
                    // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                    // attributes are not guaranteed to be returned in document order.
                    // In particular, Edge/IE can return them out of order, so we cannot
                    // assume a correspondence between part index and attribute index.
                    let count = 0;
                    for (let i = 0; i < length; i++) {
                        if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                            count++;
                        }
                    }
                    while (count-- > 0) {
                        // Get the template literal section leading up to the first
                        // expression in this attribute
                        const stringForPart = strings[partIndex];
                        // Find the attribute name
                        const name = lastAttributeNameRegex.exec(stringForPart)[2];
                        // Find the corresponding attribute
                        // All bound attributes have had a suffix added in
                        // TemplateResult#getHTML to opt out of special attribute
                        // handling. To look up the attribute value we also need to add
                        // the suffix.
                        const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                        const attributeValue = node.getAttribute(attributeLookupName);
                        node.removeAttribute(attributeLookupName);
                        const statics = attributeValue.split(markerRegex);
                        this.parts.push({ type: 'attribute', index, name, strings: statics });
                        partIndex += statics.length - 1;
                    }
                }
                if (node.tagName === 'TEMPLATE') {
                    stack.push(node);
                    walker.currentNode = node.content;
                }
            }
            else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                const data = node.data;
                if (data.indexOf(marker) >= 0) {
                    const parent = node.parentNode;
                    const strings = data.split(markerRegex);
                    const lastIndex = strings.length - 1;
                    // Generate a new text node for each literal section
                    // These nodes are also used as the markers for node parts
                    for (let i = 0; i < lastIndex; i++) {
                        let insert;
                        let s = strings[i];
                        if (s === '') {
                            insert = createMarker();
                        }
                        else {
                            const match = lastAttributeNameRegex.exec(s);
                            if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                                s = s.slice(0, match.index) + match[1] +
                                    match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                            }
                            insert = document.createTextNode(s);
                        }
                        parent.insertBefore(insert, node);
                        this.parts.push({ type: 'node', index: ++index });
                    }
                    // If there's no text, we must insert a comment to mark our place.
                    // Else, we can trust it will stick around after cloning.
                    if (strings[lastIndex] === '') {
                        parent.insertBefore(createMarker(), node);
                        nodesToRemove.push(node);
                    }
                    else {
                        node.data = strings[lastIndex];
                    }
                    // We have a part for each match found
                    partIndex += lastIndex;
                }
            }
            else if (node.nodeType === 8 /* Node.COMMENT_NODE */) {
                if (node.data === marker) {
                    const parent = node.parentNode;
                    // Add a new marker node to be the startNode of the Part if any of
                    // the following are true:
                    //  * We don't have a previousSibling
                    //  * The previousSibling is already the start of a previous part
                    if (node.previousSibling === null || index === lastPartIndex) {
                        index++;
                        parent.insertBefore(createMarker(), node);
                    }
                    lastPartIndex = index;
                    this.parts.push({ type: 'node', index });
                    // If we don't have a nextSibling, keep this node so we have an end.
                    // Else, we can remove it to save future costs.
                    if (node.nextSibling === null) {
                        node.data = '';
                    }
                    else {
                        nodesToRemove.push(node);
                        index--;
                    }
                    partIndex++;
                }
                else {
                    let i = -1;
                    while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                        // Comment node has a binding marker inside, make an inactive part
                        // The binding won't work, but subsequent bindings will
                        // TODO (justinfagnani): consider whether it's even worth it to
                        // make bindings in comments work
                        this.parts.push({ type: 'node', index: -1 });
                        partIndex++;
                    }
                }
            }
        }
        // Remove text binding nodes after the walk to not disturb the TreeWalker
        for (const n of nodesToRemove) {
            n.parentNode.removeChild(n);
        }
    }
}
const endsWith = (str, suffix) => {
    const index = str.length - suffix.length;
    return index >= 0 && str.slice(index) === suffix;
};
const isTemplatePartActive = (part) => part.index !== -1;
// Allows `document.createComment('')` to be renamed for a
// small manual size-savings.
const createMarker = () => document.createComment('');
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-characters
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
 * space character except " ".
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
const lastAttributeNameRegex = 
// eslint-disable-next-line no-control-regex
/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const walkerNodeFilter = 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */;
/**
 * Removes the list of nodes from a Template safely. In addition to removing
 * nodes from the Template, the Template part indices are updated to match
 * the mutated Template DOM.
 *
 * As the template is walked the removal state is tracked and
 * part indices are adjusted as needed.
 *
 * div
 *   div#1 (remove) <-- start removing (removing node is div#1)
 *     div
 *       div#2 (remove)  <-- continue removing (removing node is still div#1)
 *         div
 * div <-- stop removing since previous sibling is the removing node (div#1,
 * removed 4 nodes)
 */
function removeNodesFromTemplate(template, nodesToRemove) {
    const { element: { content }, parts } = template;
    const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let part = parts[partIndex];
    let nodeIndex = -1;
    let removeCount = 0;
    const nodesToRemoveInTemplate = [];
    let currentRemovingNode = null;
    while (walker.nextNode()) {
        nodeIndex++;
        const node = walker.currentNode;
        // End removal if stepped past the removing node
        if (node.previousSibling === currentRemovingNode) {
            currentRemovingNode = null;
        }
        // A node to remove was found in the template
        if (nodesToRemove.has(node)) {
            nodesToRemoveInTemplate.push(node);
            // Track node we're removing
            if (currentRemovingNode === null) {
                currentRemovingNode = node;
            }
        }
        // When removing, increment count by which to adjust subsequent part indices
        if (currentRemovingNode !== null) {
            removeCount++;
        }
        while (part !== undefined && part.index === nodeIndex) {
            // If part is in a removed node deactivate it by setting index to -1 or
            // adjust the index as needed.
            part.index = currentRemovingNode !== null ? -1 : part.index - removeCount;
            // go to the next active part.
            partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
            part = parts[partIndex];
        }
    }
    nodesToRemoveInTemplate.forEach((n) => n.parentNode.removeChild(n));
}
const countNodes = (node) => {
    let count = (node.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */) ? 0 : 1;
    const walker = document.createTreeWalker(node, walkerNodeFilter, null, false);
    while (walker.nextNode()) {
        count++;
    }
    return count;
};
const nextActiveIndexInTemplateParts = (parts, startIndex = -1) => {
    for (let i = startIndex + 1; i < parts.length; i++) {
        const part = parts[i];
        if (isTemplatePartActive(part)) {
            return i;
        }
    }
    return -1;
};
/**
 * Inserts the given node into the Template, optionally before the given
 * refNode. In addition to inserting the node into the Template, the Template
 * part indices are updated to match the mutated Template DOM.
 */
function insertNodeIntoTemplate(template, node, refNode = null) {
    const { element: { content }, parts } = template;
    // If there's no refNode, then put node at end of template.
    // No part indices need to be shifted in this case.
    if (refNode === null || refNode === undefined) {
        content.appendChild(node);
        return;
    }
    const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let insertCount = 0;
    let walkerIndex = -1;
    while (walker.nextNode()) {
        walkerIndex++;
        const walkerNode = walker.currentNode;
        if (walkerNode === refNode) {
            insertCount = countNodes(node);
            refNode.parentNode.insertBefore(node, refNode);
        }
        while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
            // If we've inserted the node, simply adjust all subsequent parts
            if (insertCount > 0) {
                while (partIndex !== -1) {
                    parts[partIndex].index += insertCount;
                    partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
                }
                return;
            }
            partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
        }
    }
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const directives = new WeakMap();
/**
 * Brands a function as a directive factory function so that lit-html will call
 * the function during template rendering, rather than passing as a value.
 *
 * A _directive_ is a function that takes a Part as an argument. It has the
 * signature: `(part: Part) => void`.
 *
 * A directive _factory_ is a function that takes arguments for data and
 * configuration and returns a directive. Users of directive usually refer to
 * the directive factory as the directive. For example, "The repeat directive".
 *
 * Usually a template author will invoke a directive factory in their template
 * with relevant arguments, which will then return a directive function.
 *
 * Here's an example of using the `repeat()` directive factory that takes an
 * array and a function to render an item:
 *
 * ```js
 * html`<ul><${repeat(items, (item) => html`<li>${item}</li>`)}</ul>`
 * ```
 *
 * When `repeat` is invoked, it returns a directive function that closes over
 * `items` and the template function. When the outer template is rendered, the
 * return directive function is called with the Part for the expression.
 * `repeat` then performs it's custom logic to render multiple items.
 *
 * @param f The directive factory function. Must be a function that returns a
 * function of the signature `(part: Part) => void`. The returned function will
 * be called with the part object.
 *
 * @example
 *
 * import {directive, html} from 'lit-html';
 *
 * const immutable = directive((v) => (part) => {
 *   if (part.value !== v) {
 *     part.setValue(v)
 *   }
 * });
 */
const directive = (f) => ((...args) => {
    const d = f(...args);
    directives.set(d, true);
    return d;
});
const isDirective = (o) => {
    return typeof o === 'function' && directives.has(o);
};

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = {};
/**
 * A sentinel value that signals a NodePart to fully clear its content.
 */
const nothing = {};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
    constructor(template, processor, options) {
        this.__parts = [];
        this.template = template;
        this.processor = processor;
        this.options = options;
    }
    update(values) {
        let i = 0;
        for (const part of this.__parts) {
            if (part !== undefined) {
                part.setValue(values[i]);
            }
            i++;
        }
        for (const part of this.__parts) {
            if (part !== undefined) {
                part.commit();
            }
        }
    }
    _clone() {
        // There are a number of steps in the lifecycle of a template instance's
        // DOM fragment:
        //  1. Clone - create the instance fragment
        //  2. Adopt - adopt into the main document
        //  3. Process - find part markers and create parts
        //  4. Upgrade - upgrade custom elements
        //  5. Update - set node, attribute, property, etc., values
        //  6. Connect - connect to the document. Optional and outside of this
        //     method.
        //
        // We have a few constraints on the ordering of these steps:
        //  * We need to upgrade before updating, so that property values will pass
        //    through any property setters.
        //  * We would like to process before upgrading so that we're sure that the
        //    cloned fragment is inert and not disturbed by self-modifying DOM.
        //  * We want custom elements to upgrade even in disconnected fragments.
        //
        // Given these constraints, with full custom elements support we would
        // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
        //
        // But Safari does not implement CustomElementRegistry#upgrade, so we
        // can not implement that order and still have upgrade-before-update and
        // upgrade disconnected fragments. So we instead sacrifice the
        // process-before-upgrade constraint, since in Custom Elements v1 elements
        // must not modify their light DOM in the constructor. We still have issues
        // when co-existing with CEv0 elements like Polymer 1, and with polyfills
        // that don't strictly adhere to the no-modification rule because shadow
        // DOM, which may be created in the constructor, is emulated by being placed
        // in the light DOM.
        //
        // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
        // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
        // in one step.
        //
        // The Custom Elements v1 polyfill supports upgrade(), so the order when
        // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
        // Connect.
        const fragment = isCEPolyfill ?
            this.template.element.content.cloneNode(true) :
            document.importNode(this.template.element.content, true);
        const stack = [];
        const parts = this.template.parts;
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
        let partIndex = 0;
        let nodeIndex = 0;
        let part;
        let node = walker.nextNode();
        // Loop through all the nodes and parts of a template
        while (partIndex < parts.length) {
            part = parts[partIndex];
            if (!isTemplatePartActive(part)) {
                this.__parts.push(undefined);
                partIndex++;
                continue;
            }
            // Progress the tree walker until we find our next part's node.
            // Note that multiple parts may share the same node (attribute parts
            // on a single element), so this loop may not run at all.
            while (nodeIndex < part.index) {
                nodeIndex++;
                if (node.nodeName === 'TEMPLATE') {
                    stack.push(node);
                    walker.currentNode = node.content;
                }
                if ((node = walker.nextNode()) === null) {
                    // We've exhausted the content inside a nested template element.
                    // Because we still have parts (the outer for-loop), we know:
                    // - There is a template in the stack
                    // - The walker will find a nextNode outside the template
                    walker.currentNode = stack.pop();
                    node = walker.nextNode();
                }
            }
            // We've arrived at our part's node.
            if (part.type === 'node') {
                const part = this.processor.handleTextExpression(this.options);
                part.insertAfterNode(node.previousSibling);
                this.__parts.push(part);
            }
            else {
                this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
            }
            partIndex++;
        }
        if (isCEPolyfill) {
            document.adoptNode(fragment);
            customElements.upgrade(fragment);
        }
        return fragment;
    }
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const commentMarker = ` ${marker} `;
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
class TemplateResult {
    constructor(strings, values, type, processor) {
        this.strings = strings;
        this.values = values;
        this.type = type;
        this.processor = processor;
    }
    /**
     * Returns a string of HTML used to create a `<template>` element.
     */
    getHTML() {
        const l = this.strings.length - 1;
        let html = '';
        let isCommentBinding = false;
        for (let i = 0; i < l; i++) {
            const s = this.strings[i];
            // For each binding we want to determine the kind of marker to insert
            // into the template source before it's parsed by the browser's HTML
            // parser. The marker type is based on whether the expression is in an
            // attribute, text, or comment position.
            //   * For node-position bindings we insert a comment with the marker
            //     sentinel as its text content, like <!--{{lit-guid}}-->.
            //   * For attribute bindings we insert just the marker sentinel for the
            //     first binding, so that we support unquoted attribute bindings.
            //     Subsequent bindings can use a comment marker because multi-binding
            //     attributes must be quoted.
            //   * For comment bindings we insert just the marker sentinel so we don't
            //     close the comment.
            //
            // The following code scans the template source, but is *not* an HTML
            // parser. We don't need to track the tree structure of the HTML, only
            // whether a binding is inside a comment, and if not, if it appears to be
            // the first binding in an attribute.
            const commentOpen = s.lastIndexOf('<!--');
            // We're in comment position if we have a comment open with no following
            // comment close. Because <-- can appear in an attribute value there can
            // be false positives.
            isCommentBinding = (commentOpen > -1 || isCommentBinding) &&
                s.indexOf('-->', commentOpen + 1) === -1;
            // Check to see if we have an attribute-like sequence preceding the
            // expression. This can match "name=value" like structures in text,
            // comments, and attribute values, so there can be false-positives.
            const attributeMatch = lastAttributeNameRegex.exec(s);
            if (attributeMatch === null) {
                // We're only in this branch if we don't have a attribute-like
                // preceding sequence. For comments, this guards against unusual
                // attribute values like <div foo="<!--${'bar'}">. Cases like
                // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
                // below.
                html += s + (isCommentBinding ? commentMarker : nodeMarker);
            }
            else {
                // For attributes we use just a marker sentinel, and also append a
                // $lit$ suffix to the name to opt-out of attribute-specific parsing
                // that IE and Edge do for style and certain SVG attributes.
                html += s.substr(0, attributeMatch.index) + attributeMatch[1] +
                    attributeMatch[2] + boundAttributeSuffix + attributeMatch[3] +
                    marker;
            }
        }
        html += this.strings[l];
        return html;
    }
    getTemplateElement() {
        const template = document.createElement('template');
        template.innerHTML = this.getHTML();
        return template;
    }
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const isPrimitive = (value) => {
    return (value === null ||
        !(typeof value === 'object' || typeof value === 'function'));
};
const isIterable = (value) => {
    return Array.isArray(value) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        !!(value && value[Symbol.iterator]);
};
/**
 * Writes attribute values to the DOM for a group of AttributeParts bound to a
 * single attribute. The value is only set once even if there are multiple parts
 * for an attribute.
 */
class AttributeCommitter {
    constructor(element, name, strings) {
        this.dirty = true;
        this.element = element;
        this.name = name;
        this.strings = strings;
        this.parts = [];
        for (let i = 0; i < strings.length - 1; i++) {
            this.parts[i] = this._createPart();
        }
    }
    /**
     * Creates a single part. Override this to create a differnt type of part.
     */
    _createPart() {
        return new AttributePart(this);
    }
    _getValue() {
        const strings = this.strings;
        const l = strings.length - 1;
        let text = '';
        for (let i = 0; i < l; i++) {
            text += strings[i];
            const part = this.parts[i];
            if (part !== undefined) {
                const v = part.value;
                if (isPrimitive(v) || !isIterable(v)) {
                    text += typeof v === 'string' ? v : String(v);
                }
                else {
                    for (const t of v) {
                        text += typeof t === 'string' ? t : String(t);
                    }
                }
            }
        }
        text += strings[l];
        return text;
    }
    commit() {
        if (this.dirty) {
            this.dirty = false;
            this.element.setAttribute(this.name, this._getValue());
        }
    }
}
/**
 * A Part that controls all or part of an attribute value.
 */
class AttributePart {
    constructor(committer) {
        this.value = undefined;
        this.committer = committer;
    }
    setValue(value) {
        if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
            this.value = value;
            // If the value is a not a directive, dirty the committer so that it'll
            // call setAttribute. If the value is a directive, it'll dirty the
            // committer if it calls setValue().
            if (!isDirective(value)) {
                this.committer.dirty = true;
            }
        }
    }
    commit() {
        while (isDirective(this.value)) {
            const directive = this.value;
            this.value = noChange;
            directive(this);
        }
        if (this.value === noChange) {
            return;
        }
        this.committer.commit();
    }
}
/**
 * A Part that controls a location within a Node tree. Like a Range, NodePart
 * has start and end locations and can set and update the Nodes between those
 * locations.
 *
 * NodeParts support several value types: primitives, Nodes, TemplateResults,
 * as well as arrays and iterables of those types.
 */
class NodePart {
    constructor(options) {
        this.value = undefined;
        this.__pendingValue = undefined;
        this.options = options;
    }
    /**
     * Appends this part into a container.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendInto(container) {
        this.startNode = container.appendChild(createMarker());
        this.endNode = container.appendChild(createMarker());
    }
    /**
     * Inserts this part after the `ref` node (between `ref` and `ref`'s next
     * sibling). Both `ref` and its next sibling must be static, unchanging nodes
     * such as those that appear in a literal section of a template.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterNode(ref) {
        this.startNode = ref;
        this.endNode = ref.nextSibling;
    }
    /**
     * Appends this part into a parent part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendIntoPart(part) {
        part.__insert(this.startNode = createMarker());
        part.__insert(this.endNode = createMarker());
    }
    /**
     * Inserts this part after the `ref` part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterPart(ref) {
        ref.__insert(this.startNode = createMarker());
        this.endNode = ref.endNode;
        ref.endNode = this.startNode;
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        if (this.startNode.parentNode === null) {
            return;
        }
        while (isDirective(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange;
            directive(this);
        }
        const value = this.__pendingValue;
        if (value === noChange) {
            return;
        }
        if (isPrimitive(value)) {
            if (value !== this.value) {
                this.__commitText(value);
            }
        }
        else if (value instanceof TemplateResult) {
            this.__commitTemplateResult(value);
        }
        else if (value instanceof Node) {
            this.__commitNode(value);
        }
        else if (isIterable(value)) {
            this.__commitIterable(value);
        }
        else if (value === nothing) {
            this.value = nothing;
            this.clear();
        }
        else {
            // Fallback, will render the string representation
            this.__commitText(value);
        }
    }
    __insert(node) {
        this.endNode.parentNode.insertBefore(node, this.endNode);
    }
    __commitNode(value) {
        if (this.value === value) {
            return;
        }
        this.clear();
        this.__insert(value);
        this.value = value;
    }
    __commitText(value) {
        const node = this.startNode.nextSibling;
        value = value == null ? '' : value;
        // If `value` isn't already a string, we explicitly convert it here in case
        // it can't be implicitly converted - i.e. it's a symbol.
        const valueAsString = typeof value === 'string' ? value : String(value);
        if (node === this.endNode.previousSibling &&
            node.nodeType === 3 /* Node.TEXT_NODE */) {
            // If we only have a single text node between the markers, we can just
            // set its value, rather than replacing it.
            // TODO(justinfagnani): Can we just check if this.value is primitive?
            node.data = valueAsString;
        }
        else {
            this.__commitNode(document.createTextNode(valueAsString));
        }
        this.value = value;
    }
    __commitTemplateResult(value) {
        const template = this.options.templateFactory(value);
        if (this.value instanceof TemplateInstance &&
            this.value.template === template) {
            this.value.update(value.values);
        }
        else {
            // Make sure we propagate the template processor from the TemplateResult
            // so that we use its syntax extension, etc. The template factory comes
            // from the render function options so that it can control template
            // caching and preprocessing.
            const instance = new TemplateInstance(template, value.processor, this.options);
            const fragment = instance._clone();
            instance.update(value.values);
            this.__commitNode(fragment);
            this.value = instance;
        }
    }
    __commitIterable(value) {
        // For an Iterable, we create a new InstancePart per item, then set its
        // value to the item. This is a little bit of overhead for every item in
        // an Iterable, but it lets us recurse easily and efficiently update Arrays
        // of TemplateResults that will be commonly returned from expressions like:
        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
        // If _value is an array, then the previous render was of an
        // iterable and _value will contain the NodeParts from the previous
        // render. If _value is not an array, clear this part and make a new
        // array for NodeParts.
        if (!Array.isArray(this.value)) {
            this.value = [];
            this.clear();
        }
        // Lets us keep track of how many items we stamped so we can clear leftover
        // items from a previous render
        const itemParts = this.value;
        let partIndex = 0;
        let itemPart;
        for (const item of value) {
            // Try to reuse an existing part
            itemPart = itemParts[partIndex];
            // If no existing part, create a new one
            if (itemPart === undefined) {
                itemPart = new NodePart(this.options);
                itemParts.push(itemPart);
                if (partIndex === 0) {
                    itemPart.appendIntoPart(this);
                }
                else {
                    itemPart.insertAfterPart(itemParts[partIndex - 1]);
                }
            }
            itemPart.setValue(item);
            itemPart.commit();
            partIndex++;
        }
        if (partIndex < itemParts.length) {
            // Truncate the parts array so _value reflects the current state
            itemParts.length = partIndex;
            this.clear(itemPart && itemPart.endNode);
        }
    }
    clear(startNode = this.startNode) {
        removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    }
}
/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */
class BooleanAttributePart {
    constructor(element, name, strings) {
        this.value = undefined;
        this.__pendingValue = undefined;
        if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
            throw new Error('Boolean attributes can only contain a single expression');
        }
        this.element = element;
        this.name = name;
        this.strings = strings;
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        while (isDirective(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange;
            directive(this);
        }
        if (this.__pendingValue === noChange) {
            return;
        }
        const value = !!this.__pendingValue;
        if (this.value !== value) {
            if (value) {
                this.element.setAttribute(this.name, '');
            }
            else {
                this.element.removeAttribute(this.name);
            }
            this.value = value;
        }
        this.__pendingValue = noChange;
    }
}
/**
 * Sets attribute values for PropertyParts, so that the value is only set once
 * even if there are multiple parts for a property.
 *
 * If an expression controls the whole property value, then the value is simply
 * assigned to the property under control. If there are string literals or
 * multiple expressions, then the strings are expressions are interpolated into
 * a string first.
 */
class PropertyCommitter extends AttributeCommitter {
    constructor(element, name, strings) {
        super(element, name, strings);
        this.single =
            (strings.length === 2 && strings[0] === '' && strings[1] === '');
    }
    _createPart() {
        return new PropertyPart(this);
    }
    _getValue() {
        if (this.single) {
            return this.parts[0].value;
        }
        return super._getValue();
    }
    commit() {
        if (this.dirty) {
            this.dirty = false;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.element[this.name] = this._getValue();
        }
    }
}
class PropertyPart extends AttributePart {
}
// Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the third
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.
let eventOptionsSupported = false;
// Wrap into an IIFE because MS Edge <= v41 does not support having try/catch
// blocks right into the body of a module
(() => {
    try {
        const options = {
            get capture() {
                eventOptionsSupported = true;
                return false;
            }
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.addEventListener('test', options, options);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.removeEventListener('test', options, options);
    }
    catch (_e) {
        // event options not supported
    }
})();
class EventPart {
    constructor(element, eventName, eventContext) {
        this.value = undefined;
        this.__pendingValue = undefined;
        this.element = element;
        this.eventName = eventName;
        this.eventContext = eventContext;
        this.__boundHandleEvent = (e) => this.handleEvent(e);
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        while (isDirective(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange;
            directive(this);
        }
        if (this.__pendingValue === noChange) {
            return;
        }
        const newListener = this.__pendingValue;
        const oldListener = this.value;
        const shouldRemoveListener = newListener == null ||
            oldListener != null &&
                (newListener.capture !== oldListener.capture ||
                    newListener.once !== oldListener.once ||
                    newListener.passive !== oldListener.passive);
        const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
        if (shouldRemoveListener) {
            this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
        }
        if (shouldAddListener) {
            this.__options = getOptions(newListener);
            this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
        }
        this.value = newListener;
        this.__pendingValue = noChange;
    }
    handleEvent(event) {
        if (typeof this.value === 'function') {
            this.value.call(this.eventContext || this.element, event);
        }
        else {
            this.value.handleEvent(event);
        }
    }
}
// We copy options because of the inconsistent behavior of browsers when reading
// the third argument of add/removeEventListener. IE11 doesn't support options
// at all. Chrome 41 only reads `capture` if the argument is an object.
const getOptions = (o) => o &&
    (eventOptionsSupported ?
        { capture: o.capture, passive: o.passive, once: o.once } :
        o.capture);

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */
function templateFactory(result) {
    let templateCache = templateCaches.get(result.type);
    if (templateCache === undefined) {
        templateCache = {
            stringsArray: new WeakMap(),
            keyString: new Map()
        };
        templateCaches.set(result.type, templateCache);
    }
    let template = templateCache.stringsArray.get(result.strings);
    if (template !== undefined) {
        return template;
    }
    // If the TemplateStringsArray is new, generate a key from the strings
    // This key is shared between all templates with identical content
    const key = result.strings.join(marker);
    // Check if we already have a Template for this key
    template = templateCache.keyString.get(key);
    if (template === undefined) {
        // If we have not seen this key before, create a new Template
        template = new Template(result, result.getTemplateElement());
        // Cache the Template for this key
        templateCache.keyString.set(key, template);
    }
    // Cache all future queries for this TemplateStringsArray
    templateCache.stringsArray.set(result.strings, template);
    return template;
}
const templateCaches = new Map();

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const parts = new WeakMap();
/**
 * Renders a template result or other value to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result Any value renderable by NodePart - typically a TemplateResult
 *     created by evaluating a template tag like `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param options RenderOptions for the entire render tree rendered to this
 *     container. Render options must *not* change between renders to the same
 *     container, as those changes will not effect previously rendered DOM.
 */
const render = (result, container, options) => {
    let part = parts.get(container);
    if (part === undefined) {
        removeNodes(container, container.firstChild);
        parts.set(container, part = new NodePart(Object.assign({ templateFactory }, options)));
        part.appendInto(container);
    }
    part.setValue(result);
    part.commit();
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * Creates Parts when a template is instantiated.
 */
class DefaultTemplateProcessor {
    /**
     * Create parts for an attribute-position binding, given the event, attribute
     * name, and string literals.
     *
     * @param element The element containing the binding
     * @param name  The attribute name
     * @param strings The string literals. There are always at least two strings,
     *   event for fully-controlled bindings with a single expression.
     */
    handleAttributeExpressions(element, name, strings, options) {
        const prefix = name[0];
        if (prefix === '.') {
            const committer = new PropertyCommitter(element, name.slice(1), strings);
            return committer.parts;
        }
        if (prefix === '@') {
            return [new EventPart(element, name.slice(1), options.eventContext)];
        }
        if (prefix === '?') {
            return [new BooleanAttributePart(element, name.slice(1), strings)];
        }
        const committer = new AttributeCommitter(element, name, strings);
        return committer.parts;
    }
    /**
     * Create parts for a text-position binding.
     * @param templateFactory
     */
    handleTextExpression(options) {
        return new NodePart(options);
    }
}
const defaultTemplateProcessor = new DefaultTemplateProcessor();

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
if (typeof window !== 'undefined') {
    (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.2.1');
}
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */
const html = (strings, ...values) => new TemplateResult(strings, values, 'html', defaultTemplateProcessor);

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// Get a key to lookup in `templateCaches`.
const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;
let compatibleShadyCSSVersion = true;
if (typeof window.ShadyCSS === 'undefined') {
    compatibleShadyCSSVersion = false;
}
else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
    console.warn(`Incompatible ShadyCSS version detected. ` +
        `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and ` +
        `@webcomponents/shadycss@1.3.1.`);
    compatibleShadyCSSVersion = false;
}
/**
 * Template factory which scopes template DOM using ShadyCSS.
 * @param scopeName {string}
 */
const shadyTemplateFactory = (scopeName) => (result) => {
    const cacheKey = getTemplateCacheKey(result.type, scopeName);
    let templateCache = templateCaches.get(cacheKey);
    if (templateCache === undefined) {
        templateCache = {
            stringsArray: new WeakMap(),
            keyString: new Map()
        };
        templateCaches.set(cacheKey, templateCache);
    }
    let template = templateCache.stringsArray.get(result.strings);
    if (template !== undefined) {
        return template;
    }
    const key = result.strings.join(marker);
    template = templateCache.keyString.get(key);
    if (template === undefined) {
        const element = result.getTemplateElement();
        if (compatibleShadyCSSVersion) {
            window.ShadyCSS.prepareTemplateDom(element, scopeName);
        }
        template = new Template(result, element);
        templateCache.keyString.set(key, template);
    }
    templateCache.stringsArray.set(result.strings, template);
    return template;
};
const TEMPLATE_TYPES = ['html', 'svg'];
/**
 * Removes all style elements from Templates for the given scopeName.
 */
const removeStylesFromLitTemplates = (scopeName) => {
    TEMPLATE_TYPES.forEach((type) => {
        const templates = templateCaches.get(getTemplateCacheKey(type, scopeName));
        if (templates !== undefined) {
            templates.keyString.forEach((template) => {
                const { element: { content } } = template;
                // IE 11 doesn't support the iterable param Set constructor
                const styles = new Set();
                Array.from(content.querySelectorAll('style')).forEach((s) => {
                    styles.add(s);
                });
                removeNodesFromTemplate(template, styles);
            });
        }
    });
};
const shadyRenderSet = new Set();
/**
 * For the given scope name, ensures that ShadyCSS style scoping is performed.
 * This is done just once per scope name so the fragment and template cannot
 * be modified.
 * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
 * to be scoped and appended to the document
 * (2) removes style elements from all lit-html Templates for this scope name.
 *
 * Note, <style> elements can only be placed into templates for the
 * initial rendering of the scope. If <style> elements are included in templates
 * dynamically rendered to the scope (after the first scope render), they will
 * not be scoped and the <style> will be left in the template and rendered
 * output.
 */
const prepareTemplateStyles = (scopeName, renderedDOM, template) => {
    shadyRenderSet.add(scopeName);
    // If `renderedDOM` is stamped from a Template, then we need to edit that
    // Template's underlying template element. Otherwise, we create one here
    // to give to ShadyCSS, which still requires one while scoping.
    const templateElement = !!template ? template.element : document.createElement('template');
    // Move styles out of rendered DOM and store.
    const styles = renderedDOM.querySelectorAll('style');
    const { length } = styles;
    // If there are no styles, skip unnecessary work
    if (length === 0) {
        // Ensure prepareTemplateStyles is called to support adding
        // styles via `prepareAdoptedCssText` since that requires that
        // `prepareTemplateStyles` is called.
        //
        // ShadyCSS will only update styles containing @apply in the template
        // given to `prepareTemplateStyles`. If no lit Template was given,
        // ShadyCSS will not be able to update uses of @apply in any relevant
        // template. However, this is not a problem because we only create the
        // template for the purpose of supporting `prepareAdoptedCssText`,
        // which doesn't support @apply at all.
        window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
        return;
    }
    const condensedStyle = document.createElement('style');
    // Collect styles into a single style. This helps us make sure ShadyCSS
    // manipulations will not prevent us from being able to fix up template
    // part indices.
    // NOTE: collecting styles is inefficient for browsers but ShadyCSS
    // currently does this anyway. When it does not, this should be changed.
    for (let i = 0; i < length; i++) {
        const style = styles[i];
        style.parentNode.removeChild(style);
        condensedStyle.textContent += style.textContent;
    }
    // Remove styles from nested templates in this scope.
    removeStylesFromLitTemplates(scopeName);
    // And then put the condensed style into the "root" template passed in as
    // `template`.
    const content = templateElement.content;
    if (!!template) {
        insertNodeIntoTemplate(template, condensedStyle, content.firstChild);
    }
    else {
        content.insertBefore(condensedStyle, content.firstChild);
    }
    // Note, it's important that ShadyCSS gets the template that `lit-html`
    // will actually render so that it can update the style inside when
    // needed (e.g. @apply native Shadow DOM case).
    window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
    const style = content.querySelector('style');
    if (window.ShadyCSS.nativeShadow && style !== null) {
        // When in native Shadow DOM, ensure the style created by ShadyCSS is
        // included in initially rendered output (`renderedDOM`).
        renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
    }
    else if (!!template) {
        // When no style is left in the template, parts will be broken as a
        // result. To fix this, we put back the style node ShadyCSS removed
        // and then tell lit to remove that node from the template.
        // There can be no style in the template in 2 cases (1) when Shady DOM
        // is in use, ShadyCSS removes all styles, (2) when native Shadow DOM
        // is in use ShadyCSS removes the style if it contains no content.
        // NOTE, ShadyCSS creates its own style so we can safely add/remove
        // `condensedStyle` here.
        content.insertBefore(condensedStyle, content.firstChild);
        const removes = new Set();
        removes.add(condensedStyle);
        removeNodesFromTemplate(template, removes);
    }
};
/**
 * Extension to the standard `render` method which supports rendering
 * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
 * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
 * or when the webcomponentsjs
 * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
 *
 * Adds a `scopeName` option which is used to scope element DOM and stylesheets
 * when native ShadowDOM is unavailable. The `scopeName` will be added to
 * the class attribute of all rendered DOM. In addition, any style elements will
 * be automatically re-written with this `scopeName` selector and moved out
 * of the rendered DOM and into the document `<head>`.
 *
 * It is common to use this render method in conjunction with a custom element
 * which renders a shadowRoot. When this is done, typically the element's
 * `localName` should be used as the `scopeName`.
 *
 * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
 * custom properties (needed only on older browsers like IE11) and a shim for
 * a deprecated feature called `@apply` that supports applying a set of css
 * custom properties to a given location.
 *
 * Usage considerations:
 *
 * * Part values in `<style>` elements are only applied the first time a given
 * `scopeName` renders. Subsequent changes to parts in style elements will have
 * no effect. Because of this, parts in style elements should only be used for
 * values that will never change, for example parts that set scope-wide theme
 * values or parts which render shared style elements.
 *
 * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
 * custom element's `constructor` is not supported. Instead rendering should
 * either done asynchronously, for example at microtask timing (for example
 * `Promise.resolve()`), or be deferred until the first time the element's
 * `connectedCallback` runs.
 *
 * Usage considerations when using shimmed custom properties or `@apply`:
 *
 * * Whenever any dynamic changes are made which affect
 * css custom properties, `ShadyCSS.styleElement(element)` must be called
 * to update the element. There are two cases when this is needed:
 * (1) the element is connected to a new parent, (2) a class is added to the
 * element that causes it to match different custom properties.
 * To address the first case when rendering a custom element, `styleElement`
 * should be called in the element's `connectedCallback`.
 *
 * * Shimmed custom properties may only be defined either for an entire
 * shadowRoot (for example, in a `:host` rule) or via a rule that directly
 * matches an element with a shadowRoot. In other words, instead of flowing from
 * parent to child as do native css custom properties, shimmed custom properties
 * flow only from shadowRoots to nested shadowRoots.
 *
 * * When using `@apply` mixing css shorthand property names with
 * non-shorthand names (for example `border` and `border-width`) is not
 * supported.
 */
const render$1 = (result, container, options) => {
    if (!options || typeof options !== 'object' || !options.scopeName) {
        throw new Error('The `scopeName` option is required.');
    }
    const scopeName = options.scopeName;
    const hasRendered = parts.has(container);
    const needsScoping = compatibleShadyCSSVersion &&
        container.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */ &&
        !!container.host;
    // Handle first render to a scope specially...
    const firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName);
    // On first scope render, render into a fragment; this cannot be a single
    // fragment that is reused since nested renders can occur synchronously.
    const renderContainer = firstScopeRender ? document.createDocumentFragment() : container;
    render(result, renderContainer, Object.assign({ templateFactory: shadyTemplateFactory(scopeName) }, options));
    // When performing first scope render,
    // (1) We've rendered into a fragment so that there's a chance to
    // `prepareTemplateStyles` before sub-elements hit the DOM
    // (which might cause them to render based on a common pattern of
    // rendering in a custom element's `connectedCallback`);
    // (2) Scope the template with ShadyCSS one time only for this scope.
    // (3) Render the fragment into the container and make sure the
    // container knows its `part` is the one we just rendered. This ensures
    // DOM will be re-used on subsequent renders.
    if (firstScopeRender) {
        const part = parts.get(renderContainer);
        parts.delete(renderContainer);
        // ShadyCSS might have style sheets (e.g. from `prepareAdoptedCssText`)
        // that should apply to `renderContainer` even if the rendered value is
        // not a TemplateInstance. However, it will only insert scoped styles
        // into the document if `prepareTemplateStyles` has already been called
        // for the given scope name.
        const template = part.value instanceof TemplateInstance ?
            part.value.template :
            undefined;
        prepareTemplateStyles(scopeName, renderContainer, template);
        removeNodes(container, container.firstChild);
        container.appendChild(renderContainer);
        parts.set(container, part);
    }
    // After elements have hit the DOM, update styling if this is the
    // initial render to this container.
    // This is needed whenever dynamic changes are made so it would be
    // safest to do every render; however, this would regress performance
    // so we leave it up to the user to call `ShadyCSS.styleElement`
    // for dynamic changes.
    if (!hasRendered && needsScoping) {
        window.ShadyCSS.styleElement(container.host);
    }
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
var _a;
/**
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
window.JSCompiler_renameProperty =
    (prop, _obj) => prop;
const defaultConverter = {
    toAttribute(value, type) {
        switch (type) {
            case Boolean:
                return value ? '' : null;
            case Object:
            case Array:
                // if the value is `null` or `undefined` pass this through
                // to allow removing/no change behavior.
                return value == null ? value : JSON.stringify(value);
        }
        return value;
    },
    fromAttribute(value, type) {
        switch (type) {
            case Boolean:
                return value !== null;
            case Number:
                return value === null ? null : Number(value);
            case Object:
            case Array:
                return JSON.parse(value);
        }
        return value;
    }
};
/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `hasChanged` function.
 */
const notEqual = (value, old) => {
    // This ensures (old==NaN, value==NaN) always returns false
    return old !== value && (old === old || value === value);
};
const defaultPropertyDeclaration = {
    attribute: true,
    type: String,
    converter: defaultConverter,
    reflect: false,
    hasChanged: notEqual
};
const STATE_HAS_UPDATED = 1;
const STATE_UPDATE_REQUESTED = 1 << 2;
const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
/**
 * The Closure JS Compiler doesn't currently have good support for static
 * property semantics where "this" is dynamic (e.g.
 * https://github.com/google/closure-compiler/issues/3177 and others) so we use
 * this hack to bypass any rewriting by the compiler.
 */
const finalized = 'finalized';
/**
 * Base element class which manages element properties and attributes. When
 * properties change, the `update` method is asynchronously called. This method
 * should be supplied by subclassers to render updates as desired.
 */
class UpdatingElement extends HTMLElement {
    constructor() {
        super();
        this._updateState = 0;
        this._instanceProperties = undefined;
        // Initialize to an unresolved Promise so we can make sure the element has
        // connected before first update.
        this._updatePromise = new Promise((res) => this._enableUpdatingResolver = res);
        /**
         * Map with keys for any properties that have changed since the last
         * update cycle with previous values.
         */
        this._changedProperties = new Map();
        /**
         * Map with keys of properties that should be reflected when updated.
         */
        this._reflectingProperties = undefined;
        this.initialize();
    }
    /**
     * Returns a list of attributes corresponding to the registered properties.
     * @nocollapse
     */
    static get observedAttributes() {
        // note: piggy backing on this to ensure we're finalized.
        this.finalize();
        const attributes = [];
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this._classProperties.forEach((v, p) => {
            const attr = this._attributeNameForProperty(p, v);
            if (attr !== undefined) {
                this._attributeToPropertyMap.set(attr, p);
                attributes.push(attr);
            }
        });
        return attributes;
    }
    /**
     * Ensures the private `_classProperties` property metadata is created.
     * In addition to `finalize` this is also called in `createProperty` to
     * ensure the `@property` decorator can add property metadata.
     */
    /** @nocollapse */
    static _ensureClassProperties() {
        // ensure private storage for property declarations.
        if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
            this._classProperties = new Map();
            // NOTE: Workaround IE11 not supporting Map constructor argument.
            const superProperties = Object.getPrototypeOf(this)._classProperties;
            if (superProperties !== undefined) {
                superProperties.forEach((v, k) => this._classProperties.set(k, v));
            }
        }
    }
    /**
     * Creates a property accessor on the element prototype if one does not exist
     * and stores a PropertyDeclaration for the property with the given options.
     * The property setter calls the property's `hasChanged` property option
     * or uses a strict identity check to determine whether or not to request
     * an update.
     *
     * This method may be overridden to customize properties; however,
     * when doing so, it's important to call `super.createProperty` to ensure
     * the property is setup correctly. This method calls
     * `getPropertyDescriptor` internally to get a descriptor to install.
     * To customize what properties do when they are get or set, override
     * `getPropertyDescriptor`. To customize the options for a property,
     * implement `createProperty` like this:
     *
     * static createProperty(name, options) {
     *   options = Object.assign(options, {myOption: true});
     *   super.createProperty(name, options);
     * }
     *
     * @nocollapse
     */
    static createProperty(name, options = defaultPropertyDeclaration) {
        // Note, since this can be called by the `@property` decorator which
        // is called before `finalize`, we ensure storage exists for property
        // metadata.
        this._ensureClassProperties();
        this._classProperties.set(name, options);
        // Do not generate an accessor if the prototype already has one, since
        // it would be lost otherwise and that would never be the user's intention;
        // Instead, we expect users to call `requestUpdate` themselves from
        // user-defined accessors. Note that if the super has an accessor we will
        // still overwrite it
        if (options.noAccessor || this.prototype.hasOwnProperty(name)) {
            return;
        }
        const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
        const descriptor = this.getPropertyDescriptor(name, key, options);
        if (descriptor !== undefined) {
            Object.defineProperty(this.prototype, name, descriptor);
        }
    }
    /**
     * Returns a property descriptor to be defined on the given named property.
     * If no descriptor is returned, the property will not become an accessor.
     * For example,
     *
     *   class MyElement extends LitElement {
     *     static getPropertyDescriptor(name, key, options) {
     *       const defaultDescriptor =
     *           super.getPropertyDescriptor(name, key, options);
     *       const setter = defaultDescriptor.set;
     *       return {
     *         get: defaultDescriptor.get,
     *         set(value) {
     *           setter.call(this, value);
     *           // custom action.
     *         },
     *         configurable: true,
     *         enumerable: true
     *       }
     *     }
     *   }
     *
     * @nocollapse
     */
    static getPropertyDescriptor(name, key, _options) {
        return {
            // tslint:disable-next-line:no-any no symbol in index
            get() {
                return this[key];
            },
            set(value) {
                const oldValue = this[name];
                this[key] = value;
                this._requestUpdate(name, oldValue);
            },
            configurable: true,
            enumerable: true
        };
    }
    /**
     * Returns the property options associated with the given property.
     * These options are defined with a PropertyDeclaration via the `properties`
     * object or the `@property` decorator and are registered in
     * `createProperty(...)`.
     *
     * Note, this method should be considered "final" and not overridden. To
     * customize the options for a given property, override `createProperty`.
     *
     * @nocollapse
     * @final
     */
    static getPropertyOptions(name) {
        return this._classProperties && this._classProperties.get(name) ||
            defaultPropertyDeclaration;
    }
    /**
     * Creates property accessors for registered properties and ensures
     * any superclasses are also finalized.
     * @nocollapse
     */
    static finalize() {
        // finalize any superclasses
        const superCtor = Object.getPrototypeOf(this);
        if (!superCtor.hasOwnProperty(finalized)) {
            superCtor.finalize();
        }
        this[finalized] = true;
        this._ensureClassProperties();
        // initialize Map populated in observedAttributes
        this._attributeToPropertyMap = new Map();
        // make any properties
        // Note, only process "own" properties since this element will inherit
        // any properties defined on the superClass, and finalization ensures
        // the entire prototype chain is finalized.
        if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
            const props = this.properties;
            // support symbols in properties (IE11 does not support this)
            const propKeys = [
                ...Object.getOwnPropertyNames(props),
                ...(typeof Object.getOwnPropertySymbols === 'function') ?
                    Object.getOwnPropertySymbols(props) :
                    []
            ];
            // This for/of is ok because propKeys is an array
            for (const p of propKeys) {
                // note, use of `any` is due to TypeSript lack of support for symbol in
                // index types
                // tslint:disable-next-line:no-any no symbol in index
                this.createProperty(p, props[p]);
            }
        }
    }
    /**
     * Returns the property name for the given attribute `name`.
     * @nocollapse
     */
    static _attributeNameForProperty(name, options) {
        const attribute = options.attribute;
        return attribute === false ?
            undefined :
            (typeof attribute === 'string' ?
                attribute :
                (typeof name === 'string' ? name.toLowerCase() : undefined));
    }
    /**
     * Returns true if a property should request an update.
     * Called when a property value is set and uses the `hasChanged`
     * option for the property if present or a strict identity check.
     * @nocollapse
     */
    static _valueHasChanged(value, old, hasChanged = notEqual) {
        return hasChanged(value, old);
    }
    /**
     * Returns the property value for the given attribute value.
     * Called via the `attributeChangedCallback` and uses the property's
     * `converter` or `converter.fromAttribute` property option.
     * @nocollapse
     */
    static _propertyValueFromAttribute(value, options) {
        const type = options.type;
        const converter = options.converter || defaultConverter;
        const fromAttribute = (typeof converter === 'function' ? converter : converter.fromAttribute);
        return fromAttribute ? fromAttribute(value, type) : value;
    }
    /**
     * Returns the attribute value for the given property value. If this
     * returns undefined, the property will *not* be reflected to an attribute.
     * If this returns null, the attribute will be removed, otherwise the
     * attribute will be set to the value.
     * This uses the property's `reflect` and `type.toAttribute` property options.
     * @nocollapse
     */
    static _propertyValueToAttribute(value, options) {
        if (options.reflect === undefined) {
            return;
        }
        const type = options.type;
        const converter = options.converter;
        const toAttribute = converter && converter.toAttribute ||
            defaultConverter.toAttribute;
        return toAttribute(value, type);
    }
    /**
     * Performs element initialization. By default captures any pre-set values for
     * registered properties.
     */
    initialize() {
        this._saveInstanceProperties();
        // ensures first update will be caught by an early access of
        // `updateComplete`
        this._requestUpdate();
    }
    /**
     * Fixes any properties set on the instance before upgrade time.
     * Otherwise these would shadow the accessor and break these properties.
     * The properties are stored in a Map which is played back after the
     * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
     * (<=41), properties created for native platform properties like (`id` or
     * `name`) may not have default values set in the element constructor. On
     * these browsers native properties appear on instances and therefore their
     * default value will overwrite any element default (e.g. if the element sets
     * this.id = 'id' in the constructor, the 'id' will become '' since this is
     * the native platform default).
     */
    _saveInstanceProperties() {
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this.constructor
            ._classProperties.forEach((_v, p) => {
            if (this.hasOwnProperty(p)) {
                const value = this[p];
                delete this[p];
                if (!this._instanceProperties) {
                    this._instanceProperties = new Map();
                }
                this._instanceProperties.set(p, value);
            }
        });
    }
    /**
     * Applies previously saved instance properties.
     */
    _applyInstanceProperties() {
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        // tslint:disable-next-line:no-any
        this._instanceProperties.forEach((v, p) => this[p] = v);
        this._instanceProperties = undefined;
    }
    connectedCallback() {
        // Ensure first connection completes an update. Updates cannot complete
        // before connection.
        this.enableUpdating();
    }
    enableUpdating() {
        if (this._enableUpdatingResolver !== undefined) {
            this._enableUpdatingResolver();
            this._enableUpdatingResolver = undefined;
        }
    }
    /**
     * Allows for `super.disconnectedCallback()` in extensions while
     * reserving the possibility of making non-breaking feature additions
     * when disconnecting at some point in the future.
     */
    disconnectedCallback() {
    }
    /**
     * Synchronizes property values when attributes change.
     */
    attributeChangedCallback(name, old, value) {
        if (old !== value) {
            this._attributeToProperty(name, value);
        }
    }
    _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
        const ctor = this.constructor;
        const attr = ctor._attributeNameForProperty(name, options);
        if (attr !== undefined) {
            const attrValue = ctor._propertyValueToAttribute(value, options);
            // an undefined value does not change the attribute.
            if (attrValue === undefined) {
                return;
            }
            // Track if the property is being reflected to avoid
            // setting the property again via `attributeChangedCallback`. Note:
            // 1. this takes advantage of the fact that the callback is synchronous.
            // 2. will behave incorrectly if multiple attributes are in the reaction
            // stack at time of calling. However, since we process attributes
            // in `update` this should not be possible (or an extreme corner case
            // that we'd like to discover).
            // mark state reflecting
            this._updateState = this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE;
            if (attrValue == null) {
                this.removeAttribute(attr);
            }
            else {
                this.setAttribute(attr, attrValue);
            }
            // mark state not reflecting
            this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
        }
    }
    _attributeToProperty(name, value) {
        // Use tracking info to avoid deserializing attribute value if it was
        // just set from a property setter.
        if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
            return;
        }
        const ctor = this.constructor;
        // Note, hint this as an `AttributeMap` so closure clearly understands
        // the type; it has issues with tracking types through statics
        // tslint:disable-next-line:no-unnecessary-type-assertion
        const propName = ctor._attributeToPropertyMap.get(name);
        if (propName !== undefined) {
            const options = ctor.getPropertyOptions(propName);
            // mark state reflecting
            this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
            this[propName] =
                // tslint:disable-next-line:no-any
                ctor._propertyValueFromAttribute(value, options);
            // mark state not reflecting
            this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
        }
    }
    /**
     * This private version of `requestUpdate` does not access or return the
     * `updateComplete` promise. This promise can be overridden and is therefore
     * not free to access.
     */
    _requestUpdate(name, oldValue) {
        let shouldRequestUpdate = true;
        // If we have a property key, perform property update steps.
        if (name !== undefined) {
            const ctor = this.constructor;
            const options = ctor.getPropertyOptions(name);
            if (ctor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
                if (!this._changedProperties.has(name)) {
                    this._changedProperties.set(name, oldValue);
                }
                // Add to reflecting properties set.
                // Note, it's important that every change has a chance to add the
                // property to `_reflectingProperties`. This ensures setting
                // attribute + property reflects correctly.
                if (options.reflect === true &&
                    !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
                    if (this._reflectingProperties === undefined) {
                        this._reflectingProperties = new Map();
                    }
                    this._reflectingProperties.set(name, options);
                }
            }
            else {
                // Abort the request if the property should not be considered changed.
                shouldRequestUpdate = false;
            }
        }
        if (!this._hasRequestedUpdate && shouldRequestUpdate) {
            this._updatePromise = this._enqueueUpdate();
        }
    }
    /**
     * Requests an update which is processed asynchronously. This should
     * be called when an element should update based on some state not triggered
     * by setting a property. In this case, pass no arguments. It should also be
     * called when manually implementing a property setter. In this case, pass the
     * property `name` and `oldValue` to ensure that any configured property
     * options are honored. Returns the `updateComplete` Promise which is resolved
     * when the update completes.
     *
     * @param name {PropertyKey} (optional) name of requesting property
     * @param oldValue {any} (optional) old value of requesting property
     * @returns {Promise} A Promise that is resolved when the update completes.
     */
    requestUpdate(name, oldValue) {
        this._requestUpdate(name, oldValue);
        return this.updateComplete;
    }
    /**
     * Sets up the element to asynchronously update.
     */
    async _enqueueUpdate() {
        this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
        try {
            // Ensure any previous update has resolved before updating.
            // This `await` also ensures that property changes are batched.
            await this._updatePromise;
        }
        catch (e) {
            // Ignore any previous errors. We only care that the previous cycle is
            // done. Any error should have been handled in the previous update.
        }
        const result = this.performUpdate();
        // If `performUpdate` returns a Promise, we await it. This is done to
        // enable coordinating updates with a scheduler. Note, the result is
        // checked to avoid delaying an additional microtask unless we need to.
        if (result != null) {
            await result;
        }
        return !this._hasRequestedUpdate;
    }
    get _hasRequestedUpdate() {
        return (this._updateState & STATE_UPDATE_REQUESTED);
    }
    get hasUpdated() {
        return (this._updateState & STATE_HAS_UPDATED);
    }
    /**
     * Performs an element update. Note, if an exception is thrown during the
     * update, `firstUpdated` and `updated` will not be called.
     *
     * You can override this method to change the timing of updates. If this
     * method is overridden, `super.performUpdate()` must be called.
     *
     * For instance, to schedule updates to occur just before the next frame:
     *
     * ```
     * protected async performUpdate(): Promise<unknown> {
     *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
     *   super.performUpdate();
     * }
     * ```
     */
    performUpdate() {
        // Mixin instance properties once, if they exist.
        if (this._instanceProperties) {
            this._applyInstanceProperties();
        }
        let shouldUpdate = false;
        const changedProperties = this._changedProperties;
        try {
            shouldUpdate = this.shouldUpdate(changedProperties);
            if (shouldUpdate) {
                this.update(changedProperties);
            }
            else {
                this._markUpdated();
            }
        }
        catch (e) {
            // Prevent `firstUpdated` and `updated` from running when there's an
            // update exception.
            shouldUpdate = false;
            // Ensure element can accept additional updates after an exception.
            this._markUpdated();
            throw e;
        }
        if (shouldUpdate) {
            if (!(this._updateState & STATE_HAS_UPDATED)) {
                this._updateState = this._updateState | STATE_HAS_UPDATED;
                this.firstUpdated(changedProperties);
            }
            this.updated(changedProperties);
        }
    }
    _markUpdated() {
        this._changedProperties = new Map();
        this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
    }
    /**
     * Returns a Promise that resolves when the element has completed updating.
     * The Promise value is a boolean that is `true` if the element completed the
     * update without triggering another update. The Promise result is `false` if
     * a property was set inside `updated()`. If the Promise is rejected, an
     * exception was thrown during the update.
     *
     * To await additional asynchronous work, override the `_getUpdateComplete`
     * method. For example, it is sometimes useful to await a rendered element
     * before fulfilling this Promise. To do this, first await
     * `super._getUpdateComplete()`, then any subsequent state.
     *
     * @returns {Promise} The Promise returns a boolean that indicates if the
     * update resolved without triggering another update.
     */
    get updateComplete() {
        return this._getUpdateComplete();
    }
    /**
     * Override point for the `updateComplete` promise.
     *
     * It is not safe to override the `updateComplete` getter directly due to a
     * limitation in TypeScript which means it is not possible to call a
     * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
     * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
     * This method should be overridden instead. For example:
     *
     *   class MyElement extends LitElement {
     *     async _getUpdateComplete() {
     *       await super._getUpdateComplete();
     *       await this._myChild.updateComplete;
     *     }
     *   }
     */
    _getUpdateComplete() {
        return this._updatePromise;
    }
    /**
     * Controls whether or not `update` should be called when the element requests
     * an update. By default, this method always returns `true`, but this can be
     * customized to control when to update.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    shouldUpdate(_changedProperties) {
        return true;
    }
    /**
     * Updates the element. This method reflects property values to attributes.
     * It can be overridden to render and keep updated element DOM.
     * Setting properties inside this method will *not* trigger
     * another update.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    update(_changedProperties) {
        if (this._reflectingProperties !== undefined &&
            this._reflectingProperties.size > 0) {
            // Use forEach so this works even if for/of loops are compiled to for
            // loops expecting arrays
            this._reflectingProperties.forEach((v, k) => this._propertyToAttribute(k, this[k], v));
            this._reflectingProperties = undefined;
        }
        this._markUpdated();
    }
    /**
     * Invoked whenever the element is updated. Implement to perform
     * post-updating tasks via DOM APIs, for example, focusing an element.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    updated(_changedProperties) {
    }
    /**
     * Invoked when the element is first updated. Implement to perform one time
     * work on the element after update.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    firstUpdated(_changedProperties) {
    }
}
_a = finalized;
/**
 * Marks class as having finished creating properties.
 */
UpdatingElement[_a] = true;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const legacyCustomElement = (tagName, clazz) => {
    window.customElements.define(tagName, clazz);
    // Cast as any because TS doesn't recognize the return type as being a
    // subtype of the decorated class when clazz is typed as
    // `Constructor<HTMLElement>` for some reason.
    // `Constructor<HTMLElement>` is helpful to make sure the decorator is
    // applied to elements however.
    // tslint:disable-next-line:no-any
    return clazz;
};
const standardCustomElement = (tagName, descriptor) => {
    const { kind, elements } = descriptor;
    return {
        kind,
        elements,
        // This callback is called once the class is otherwise fully defined
        finisher(clazz) {
            window.customElements.define(tagName, clazz);
        }
    };
};
/**
 * Class decorator factory that defines the decorated class as a custom element.
 *
 * ```
 * @customElement('my-element')
 * class MyElement {
 *   render() {
 *     return html``;
 *   }
 * }
 * ```
 *
 * @param tagName The name of the custom element to define.
 */
const customElement = (tagName) => (classOrDescriptor) => (typeof classOrDescriptor === 'function') ?
    legacyCustomElement(tagName, classOrDescriptor) :
    standardCustomElement(tagName, classOrDescriptor);
const standardProperty = (options, element) => {
    // When decorating an accessor, pass it through and add property metadata.
    // Note, the `hasOwnProperty` check in `createProperty` ensures we don't
    // stomp over the user's accessor.
    if (element.kind === 'method' && element.descriptor &&
        !('value' in element.descriptor)) {
        return Object.assign(Object.assign({}, element), { finisher(clazz) {
                clazz.createProperty(element.key, options);
            } });
    }
    else {
        // createProperty() takes care of defining the property, but we still
        // must return some kind of descriptor, so return a descriptor for an
        // unused prototype field. The finisher calls createProperty().
        return {
            kind: 'field',
            key: Symbol(),
            placement: 'own',
            descriptor: {},
            // When @babel/plugin-proposal-decorators implements initializers,
            // do this instead of the initializer below. See:
            // https://github.com/babel/babel/issues/9260 extras: [
            //   {
            //     kind: 'initializer',
            //     placement: 'own',
            //     initializer: descriptor.initializer,
            //   }
            // ],
            initializer() {
                if (typeof element.initializer === 'function') {
                    this[element.key] = element.initializer.call(this);
                }
            },
            finisher(clazz) {
                clazz.createProperty(element.key, options);
            }
        };
    }
};
const legacyProperty = (options, proto, name) => {
    proto.constructor
        .createProperty(name, options);
};
/**
 * A property decorator which creates a LitElement property which reflects a
 * corresponding attribute value. A `PropertyDeclaration` may optionally be
 * supplied to configure property features.
 *
 * This decorator should only be used for public fields. Private or protected
 * fields should use the internalProperty decorator.
 *
 * @example
 *
 *     class MyElement {
 *       @property({ type: Boolean })
 *       clicked = false;
 *     }
 *
 * @ExportDecoratedItems
 */
function property(options) {
    // tslint:disable-next-line:no-any decorator
    return (protoOrDescriptor, name) => (name !== undefined) ?
        legacyProperty(options, protoOrDescriptor, name) :
        standardProperty(options, protoOrDescriptor);
}
/**
 * Declares a private or protected property that still triggers updates to the
 * element when it changes.
 *
 * Properties declared this way must not be used from HTML or HTML templating
 * systems, they're solely for properties internal to the element. These
 * properties may be renamed by optimization tools like closure compiler.
 */
function internalProperty(options) {
    return property({ attribute: false, hasChanged: options === null || options === void 0 ? void 0 : options.hasChanged });
}

/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const supportsAdoptingStyleSheets = ('adoptedStyleSheets' in Document.prototype) &&
    ('replace' in CSSStyleSheet.prototype);
const constructionToken = Symbol();
class CSSResult {
    constructor(cssText, safeToken) {
        if (safeToken !== constructionToken) {
            throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        }
        this.cssText = cssText;
    }
    // Note, this is a getter so that it's lazy. In practice, this means
    // stylesheets are not created until the first element instance is made.
    get styleSheet() {
        if (this._styleSheet === undefined) {
            // Note, if `adoptedStyleSheets` is supported then we assume CSSStyleSheet
            // is constructable.
            if (supportsAdoptingStyleSheets) {
                this._styleSheet = new CSSStyleSheet();
                this._styleSheet.replaceSync(this.cssText);
            }
            else {
                this._styleSheet = null;
            }
        }
        return this._styleSheet;
    }
    toString() {
        return this.cssText;
    }
}
/**
 * Wrap a value for interpolation in a css tagged template literal.
 *
 * This is unsafe because untrusted CSS text can be used to phone home
 * or exfiltrate data to an attacker controlled site. Take care to only use
 * this with trusted input.
 */
const unsafeCSS = (value) => {
    return new CSSResult(String(value), constructionToken);
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for LitElement usage.
// TODO(justinfagnani): inject version number at build time
(window['litElementVersions'] || (window['litElementVersions'] = []))
    .push('2.3.1');
/**
 * Sentinal value used to avoid calling lit-html's render function when
 * subclasses do not implement `render`
 */
const renderNotImplemented = {};
class LitElement extends UpdatingElement {
    /**
     * Return the array of styles to apply to the element.
     * Override this method to integrate into a style management system.
     *
     * @nocollapse
     */
    static getStyles() {
        return this.styles;
    }
    /** @nocollapse */
    static _getUniqueStyles() {
        // Only gather styles once per class
        if (this.hasOwnProperty(JSCompiler_renameProperty('_styles', this))) {
            return;
        }
        // Take care not to call `this.getStyles()` multiple times since this
        // generates new CSSResults each time.
        // TODO(sorvell): Since we do not cache CSSResults by input, any
        // shared styles will generate new stylesheet objects, which is wasteful.
        // This should be addressed when a browser ships constructable
        // stylesheets.
        const userStyles = this.getStyles();
        if (userStyles === undefined) {
            this._styles = [];
        }
        else if (Array.isArray(userStyles)) {
            // De-duplicate styles preserving the _last_ instance in the set.
            // This is a performance optimization to avoid duplicated styles that can
            // occur especially when composing via subclassing.
            // The last item is kept to try to preserve the cascade order with the
            // assumption that it's most important that last added styles override
            // previous styles.
            const addStyles = (styles, set) => styles.reduceRight((set, s) => 
            // Note: On IE set.add() does not return the set
            Array.isArray(s) ? addStyles(s, set) : (set.add(s), set), set);
            // Array.from does not work on Set in IE, otherwise return
            // Array.from(addStyles(userStyles, new Set<CSSResult>())).reverse()
            const set = addStyles(userStyles, new Set());
            const styles = [];
            set.forEach((v) => styles.unshift(v));
            this._styles = styles;
        }
        else {
            this._styles = [userStyles];
        }
    }
    /**
     * Performs element initialization. By default this calls `createRenderRoot`
     * to create the element `renderRoot` node and captures any pre-set values for
     * registered properties.
     */
    initialize() {
        super.initialize();
        this.constructor._getUniqueStyles();
        this.renderRoot =
            this.createRenderRoot();
        // Note, if renderRoot is not a shadowRoot, styles would/could apply to the
        // element's getRootNode(). While this could be done, we're choosing not to
        // support this now since it would require different logic around de-duping.
        if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
            this.adoptStyles();
        }
    }
    /**
     * Returns the node into which the element should render and by default
     * creates and returns an open shadowRoot. Implement to customize where the
     * element's DOM is rendered. For example, to render into the element's
     * childNodes, return `this`.
     * @returns {Element|DocumentFragment} Returns a node into which to render.
     */
    createRenderRoot() {
        return this.attachShadow({ mode: 'open' });
    }
    /**
     * Applies styling to the element shadowRoot using the `static get styles`
     * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
     * available and will fallback otherwise. When Shadow DOM is polyfilled,
     * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
     * is available but `adoptedStyleSheets` is not, styles are appended to the
     * end of the `shadowRoot` to [mimic spec
     * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
     */
    adoptStyles() {
        const styles = this.constructor._styles;
        if (styles.length === 0) {
            return;
        }
        // There are three separate cases here based on Shadow DOM support.
        // (1) shadowRoot polyfilled: use ShadyCSS
        // (2) shadowRoot.adoptedStyleSheets available: use it.
        // (3) shadowRoot.adoptedStyleSheets polyfilled: append styles after
        // rendering
        if (window.ShadyCSS !== undefined && !window.ShadyCSS.nativeShadow) {
            window.ShadyCSS.ScopingShim.prepareAdoptedCssText(styles.map((s) => s.cssText), this.localName);
        }
        else if (supportsAdoptingStyleSheets) {
            this.renderRoot.adoptedStyleSheets =
                styles.map((s) => s.styleSheet);
        }
        else {
            // This must be done after rendering so the actual style insertion is done
            // in `update`.
            this._needsShimAdoptedStyleSheets = true;
        }
    }
    connectedCallback() {
        super.connectedCallback();
        // Note, first update/render handles styleElement so we only call this if
        // connected after first update.
        if (this.hasUpdated && window.ShadyCSS !== undefined) {
            window.ShadyCSS.styleElement(this);
        }
    }
    /**
     * Updates the element. This method reflects property values to attributes
     * and calls `render` to render DOM via lit-html. Setting properties inside
     * this method will *not* trigger another update.
     * @param _changedProperties Map of changed properties with old values
     */
    update(changedProperties) {
        // Setting properties in `render` should not trigger an update. Since
        // updates are allowed after super.update, it's important to call `render`
        // before that.
        const templateResult = this.render();
        super.update(changedProperties);
        // If render is not implemented by the component, don't call lit-html render
        if (templateResult !== renderNotImplemented) {
            this.constructor
                .render(templateResult, this.renderRoot, { scopeName: this.localName, eventContext: this });
        }
        // When native Shadow DOM is used but adoptedStyles are not supported,
        // insert styling after rendering to ensure adoptedStyles have highest
        // priority.
        if (this._needsShimAdoptedStyleSheets) {
            this._needsShimAdoptedStyleSheets = false;
            this.constructor._styles.forEach((s) => {
                const style = document.createElement('style');
                style.textContent = s.cssText;
                this.renderRoot.appendChild(style);
            });
        }
    }
    /**
     * Invoked on each update to perform rendering tasks. This method may return
     * any value renderable by lit-html's NodePart - typically a TemplateResult.
     * Setting properties inside this method will *not* trigger the element to
     * update.
     */
    render() {
        return renderNotImplemented;
    }
}
/**
 * Ensure this class is marked as `finalized` as an optimization ensuring
 * it will not needlessly try to `finalize`.
 *
 * Note this property name is a string to prevent breaking Closure JS Compiler
 * optimizations. See updating-element.ts for more information.
 */
LitElement['finalized'] = true;
/**
 * Render method used to render the value to the element's DOM.
 * @param result The value to render.
 * @param container Node into which to render.
 * @param options Element name.
 * @nocollapse
 */
LitElement.render = render$1;

let Button = class Button extends LitElement {
    render() {
        return html `
            <div class=${modules_79b43374.button}>
                <div class=${modules_79b43374.buttonContent}>
                    <slot></slot>
                </div>
            </div>
        `;
    }
};
Button.styles = unsafeCSS(css);
Button = __decorate([
    customElement('my-button')
], Button);

const css$1 = ".toolbar_4a429c0a {\n  padding: 16px;\n  line-height: 16px;\n  display: flex; }\n\n.toolbarTitle_4a429c0a {\n  font-weight: 500;\n  display: flex;\n  flex: 1 0 auto; }\n\n.toolbarOptions_4a429c0a {\n  font-weight: 500; }\n";
const modules_b2e3cb74 = {"toolbar":"toolbar_4a429c0a","toolbarTitle":"toolbarTitle_4a429c0a","toolbarOptions":"toolbarOptions_4a429c0a"};

let Toolbar = class Toolbar extends LitElement {
    constructor() {
        super(...arguments);
        this.title = '';
    }
    render() {
        return html `
            <div class=${modules_b2e3cb74.toolbar}>
                <div class=${modules_b2e3cb74.toolbarTitle}>${this.title}</div>
                <div class=${modules_b2e3cb74.toolbarOptions}>
                    <slot></slot>
                </div>
            </div>
        `;
    }
};
Toolbar.styles = unsafeCSS(css$1);
__decorate([
    property({ type: String })
], Toolbar.prototype, "title", void 0);
Toolbar = __decorate([
    customElement('my-toolbar')
], Toolbar);

const css$2 = "@-webkit-keyframes dashLoading_15cc1833 {\n  0% {\n    stroke-dasharray: 1,200;\n    stroke-dashoffset: 0; }\n  50% {\n    stroke-dasharray: 89,200;\n    stroke-dashoffset: -35; }\n  100% {\n    stroke-dasharray: 89,200;\n    stroke-dashoffset: -124; } }\n\n@keyframes dashLoading_15cc1833 {\n  0% {\n    stroke-dasharray: 1,200;\n    stroke-dashoffset: 0; }\n  50% {\n    stroke-dasharray: 89,200;\n    stroke-dashoffset: -35; }\n  100% {\n    stroke-dasharray: 89,200;\n    stroke-dashoffset: -124; } }\n\n.loadingIndicator_15cc1833 {\n  width: 100px;\n  height: 100px;\n  position: relative;\n  display: inline-block; }\n\n.centered_15cc1833 {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  margin: auto; }\n\n.spinner_15cc1833 {\n  width: 100px;\n  height: 100px;\n  -webkit-animation: spin_15cc1833 3s linear infinite;\n          animation: spin_15cc1833 3s linear infinite;\n  position: relative; }\n\n.path_15cc1833 {\n  -webkit-animation: dashLoading_15cc1833 1.5s ease-in-out infinite;\n          animation: dashLoading_15cc1833 1.5s ease-in-out infinite;\n  fill: rgba(0, 0, 0, 0);\n  stroke: #FFFF00;\n  stroke-dasharray: 1,200;\n  stroke-dashoffset: 0;\n  stroke-width: 6;\n  stroke-miterlimit: 20;\n  stroke-linecap: round; }\n";
const modules_b42352cd = {"loadingIndicator":"loadingIndicator_15cc1833","centered":"centered_15cc1833","spinner":"spinner_15cc1833","spin":"spin_15cc1833","path":"path_15cc1833","dashLoading":"dashLoading_15cc1833"};

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// IE11 doesn't support classList on SVG elements, so we emulate it with a Set
class ClassList {
    constructor(element) {
        this.classes = new Set();
        this.changed = false;
        this.element = element;
        const classList = (element.getAttribute('class') || '').split(/\s+/);
        for (const cls of classList) {
            this.classes.add(cls);
        }
    }
    add(cls) {
        this.classes.add(cls);
        this.changed = true;
    }
    remove(cls) {
        this.classes.delete(cls);
        this.changed = true;
    }
    commit() {
        if (this.changed) {
            let classString = '';
            this.classes.forEach((cls) => classString += cls + ' ');
            this.element.setAttribute('class', classString);
        }
    }
}
/**
 * Stores the ClassInfo object applied to a given AttributePart.
 * Used to unset existing values when a new ClassInfo object is applied.
 */
const previousClassesCache = new WeakMap();
/**
 * A directive that applies CSS classes. This must be used in the `class`
 * attribute and must be the only part used in the attribute. It takes each
 * property in the `classInfo` argument and adds the property name to the
 * element's `class` if the property value is truthy; if the property value is
 * falsey, the property name is removed from the element's `class`. For example
 * `{foo: bar}` applies the class `foo` if the value of `bar` is truthy.
 * @param classInfo {ClassInfo}
 */
const classMap = directive((classInfo) => (part) => {
    if (!(part instanceof AttributePart) || (part instanceof PropertyPart) ||
        part.committer.name !== 'class' || part.committer.parts.length > 1) {
        throw new Error('The `classMap` directive must be used in the `class` attribute ' +
            'and must be the only part in the attribute.');
    }
    const { committer } = part;
    const { element } = committer;
    let previousClasses = previousClassesCache.get(part);
    if (previousClasses === undefined) {
        // Write static classes once
        // Use setAttribute() because className isn't a string on SVG elements
        element.setAttribute('class', committer.strings.join(' '));
        previousClassesCache.set(part, previousClasses = new Set());
    }
    const classList = (element.classList || new ClassList(element));
    // Remove old classes that no longer apply
    // We use forEach() instead of for-of so that re don't require down-level
    // iteration.
    previousClasses.forEach((name) => {
        if (!(name in classInfo)) {
            classList.remove(name);
            previousClasses.delete(name);
        }
    });
    // Add or remove classes based on their classMap value
    for (const name in classInfo) {
        const value = classInfo[name];
        if (value != previousClasses.has(name)) {
            // We explicitly want a loose truthy check of `value` because it seems
            // more convenient that '' and 0 are skipped.
            if (value) {
                classList.add(name);
                previousClasses.add(name);
            }
            else {
                classList.remove(name);
                previousClasses.delete(name);
            }
        }
    }
    if (typeof classList.commit === 'function') {
        classList.commit();
    }
});

let LoadingSpinner = class LoadingSpinner extends LitElement {
    constructor() {
        super(...arguments);
        this.centered = false;
    }
    render() {
        return html `
            <div class="${classMap({ [modules_b42352cd.loadingIndicator]: true, [modules_b42352cd.centered]: this.centered })}">
                <svg class=${modules_b42352cd.spinner}>
                    <circle class=${modules_b42352cd.path} cx="50" cy="50" r="20"/>
                </svg>
            </div>
        `;
    }
};
LoadingSpinner.styles = unsafeCSS(css$2);
__decorate([
    property({ type: Boolean })
], LoadingSpinner.prototype, "centered", void 0);
LoadingSpinner = __decorate([
    customElement('my-loading-spinner')
], LoadingSpinner);

const css$3 = "::-webkit-scrollbar {\n  width: 6px;\n  height: 6px; }\n\n::-webkit-scrollbar-button {\n  width: 0;\n  height: 0; }\n\n::-webkit-scrollbar-thumb {\n  background: rgba(255, 255, 255, 0.1);\n  border: 0 none;\n  border-radius: 0; }\n\n::-webkit-scrollbar-thumb:hover {\n  background: rgba(255, 255, 255, 0.1); }\n\n::-webkit-scrollbar-thumb:active {\n  background: rgba(255, 255, 255, 0.1); }\n\n::-webkit-scrollbar-track {\n  background: rgba(0, 0, 0, 0.2);\n  border: 0 none;\n  border-radius: 0; }\n\n::-webkit-scrollbar-track:hover {\n  background: rgba(0, 0, 0, 0.2); }\n\n::-webkit-scrollbar-track:active {\n  background: rgba(0, 0, 0, 0.2); }\n\n::-webkit-scrollbar-corner {\n  background: transparent; }\n\n* {\n  box-sizing: border-box; }\n\n.app_e274581c {\n  min-width: 1120px;\n  transition: transform 350ms ease;\n  padding-left: 320px;\n  position: absolute;\n  display: block;\n  width: 100%;\n  left: 0;\n  top: 0;\n  bottom: 0; }\n\n.navigation_e274581c {\n  transition: all 350ms ease;\n  width: 320px;\n  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n  background: #232323;\n  position: absolute;\n  overflow: hidden;\n  outline: none;\n  height: 100%;\n  bottom: 0;\n  left: 0;\n  top: 0; }\n\n.viewport_e274581c {\n  position: absolute;\n  overflow-y: auto;\n  width: 100%;\n  bottom: 0;\n  left: 0;\n  top: 0; }\n\n.content_e274581c {\n  position: relative;\n  overflow-x: hidden;\n  overflow-y: auto;\n  height: 100%; }\n\n.title_e274581c {\n  height: 64px;\n  padding: 8px 16px;\n  line-height: 48px;\n  font-size: 20px;\n  font-weight: 500;\n  color: #FFFFFF;\n  position: relative;\n  overflow: hidden;\n  cursor: default;\n  margin: 0; }\n";
const modules_5209ed1c = {"app":"app_e274581c","navigation":"navigation_e274581c","viewport":"viewport_e274581c","content":"content_e274581c","title":"title_e274581c"};

/** MobX - (c) Michel Weststrate 2015 - 2020 - MIT Licensed */
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

var OBFUSCATED_ERROR = "An invariant failed, however the error is obfuscated because this is a production build.";
var EMPTY_ARRAY = [];
Object.freeze(EMPTY_ARRAY);
var EMPTY_OBJECT = {};
Object.freeze(EMPTY_OBJECT);
function getNextId() {
    return ++globalState.mobxGuid;
}
function fail(message) {
    invariant(false, message);
    throw "X"; // unreachable
}
function invariant(check, message) {
    if (!check)
        throw new Error("[mobx] " + (message || OBFUSCATED_ERROR));
}
/**
 * Prints a deprecation message, but only one time.
 * Returns false if the deprecated message was already printed before
 */
var deprecatedMessages = [];
function deprecated(msg, thing) {
    if (process.env.NODE_ENV === "production")
        return false;
    if (thing) {
        return deprecated("'" + msg + "', use '" + thing + "' instead.");
    }
    if (deprecatedMessages.indexOf(msg) !== -1)
        return false;
    deprecatedMessages.push(msg);
    console.error("[mobx] Deprecated: " + msg);
    return true;
}
/**
 * Makes sure that the provided function is invoked at most once.
 */
function once(func) {
    var invoked = false;
    return function () {
        if (invoked)
            return;
        invoked = true;
        return func.apply(this, arguments);
    };
}
var noop = function () { };
function unique(list) {
    var res = [];
    list.forEach(function (item) {
        if (res.indexOf(item) === -1)
            res.push(item);
    });
    return res;
}
function isObject(value) {
    return value !== null && typeof value === "object";
}
function isPlainObject(value) {
    if (value === null || typeof value !== "object")
        return false;
    var proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}
function addHiddenProp(object, propName, value) {
    Object.defineProperty(object, propName, {
        enumerable: false,
        writable: true,
        configurable: true,
        value: value
    });
}
function addHiddenFinalProp(object, propName, value) {
    Object.defineProperty(object, propName, {
        enumerable: false,
        writable: false,
        configurable: true,
        value: value
    });
}
function isPropertyConfigurable(object, prop) {
    var descriptor = Object.getOwnPropertyDescriptor(object, prop);
    return !descriptor || (descriptor.configurable !== false && descriptor.writable !== false);
}
function assertPropertyConfigurable(object, prop) {
    if (process.env.NODE_ENV !== "production" && !isPropertyConfigurable(object, prop))
        fail("Cannot make property '" + prop.toString() + "' observable, it is not configurable and writable in the target object");
}
function createInstanceofPredicate(name, clazz) {
    var propName = "isMobX" + name;
    clazz.prototype[propName] = true;
    return function (x) {
        return isObject(x) && x[propName] === true;
    };
}
function isES6Map(thing) {
    return thing instanceof Map;
}
function isES6Set(thing) {
    return thing instanceof Set;
}
/**
 * Returns the following: own keys, prototype keys & own symbol keys, if they are enumerable.
 */
function getPlainObjectKeys(object) {
    var enumerables = new Set();
    for (var key in object)
        enumerables.add(key); // *all* enumerables
    Object.getOwnPropertySymbols(object).forEach(function (k) {
        if (Object.getOwnPropertyDescriptor(object, k).enumerable)
            enumerables.add(k);
    }); // *own* symbols
    // Note: this implementation is missing enumerable, inherited, symbolic property names! That would however pretty expensive to add,
    // as there is no efficient iterator that returns *all* properties
    return Array.from(enumerables);
}
function stringifyKey(key) {
    if (key && key.toString)
        return key.toString();
    else
        return new String(key).toString();
}
function getMapLikeKeys(map) {
    if (isPlainObject(map))
        return Object.keys(map);
    if (Array.isArray(map))
        return map.map(function (_a) {
            var _b = __read(_a, 1), key = _b[0];
            return key;
        });
    if (isES6Map(map) || isObservableMap(map))
        return Array.from(map.keys());
    return fail("Cannot get keys from '" + map + "'");
}
function toPrimitive(value) {
    return value === null ? null : typeof value === "object" ? "" + value : value;
}

var $mobx = Symbol("mobx administration");
var Atom = /** @class */ (function () {
    /**
     * Create a new atom. For debugging purposes it is recommended to give it a name.
     * The onBecomeObserved and onBecomeUnobserved callbacks can be used for resource management.
     */
    function Atom(name) {
        if (name === void 0) { name = "Atom@" + getNextId(); }
        this.name = name;
        this.isPendingUnobservation = false; // for effective unobserving. BaseAtom has true, for extra optimization, so its onBecomeUnobserved never gets called, because it's not needed
        this.isBeingObserved = false;
        this.observers = new Set();
        this.diffValue = 0;
        this.lastAccessedBy = 0;
        this.lowestObserverState = IDerivationState.NOT_TRACKING;
    }
    Atom.prototype.onBecomeObserved = function () {
        if (this.onBecomeObservedListeners) {
            this.onBecomeObservedListeners.forEach(function (listener) { return listener(); });
        }
    };
    Atom.prototype.onBecomeUnobserved = function () {
        if (this.onBecomeUnobservedListeners) {
            this.onBecomeUnobservedListeners.forEach(function (listener) { return listener(); });
        }
    };
    /**
     * Invoke this method to notify mobx that your atom has been used somehow.
     * Returns true if there is currently a reactive context.
     */
    Atom.prototype.reportObserved = function () {
        return reportObserved(this);
    };
    /**
     * Invoke this method _after_ this method has changed to signal mobx that all its observers should invalidate.
     */
    Atom.prototype.reportChanged = function () {
        startBatch();
        propagateChanged(this);
        endBatch();
    };
    Atom.prototype.toString = function () {
        return this.name;
    };
    return Atom;
}());
var isAtom = createInstanceofPredicate("Atom", Atom);
function createAtom(name, onBecomeObservedHandler, onBecomeUnobservedHandler) {
    if (onBecomeObservedHandler === void 0) { onBecomeObservedHandler = noop; }
    if (onBecomeUnobservedHandler === void 0) { onBecomeUnobservedHandler = noop; }
    var atom = new Atom(name);
    // default `noop` listener will not initialize the hook Set
    if (onBecomeObservedHandler !== noop) {
        onBecomeObserved(atom, onBecomeObservedHandler);
    }
    if (onBecomeUnobservedHandler !== noop) {
        onBecomeUnobserved(atom, onBecomeUnobservedHandler);
    }
    return atom;
}

function identityComparer(a, b) {
    return a === b;
}
function structuralComparer(a, b) {
    return deepEqual(a, b);
}
function shallowComparer(a, b) {
    return deepEqual(a, b, 1);
}
function defaultComparer(a, b) {
    return Object.is(a, b);
}
var comparer = {
    identity: identityComparer,
    structural: structuralComparer,
    default: defaultComparer,
    shallow: shallowComparer
};

var mobxDidRunLazyInitializersSymbol = Symbol("mobx did run lazy initializers");
var mobxPendingDecorators = Symbol("mobx pending decorators");
var enumerableDescriptorCache = {};
var nonEnumerableDescriptorCache = {};
function createPropertyInitializerDescriptor(prop, enumerable) {
    var cache = enumerable ? enumerableDescriptorCache : nonEnumerableDescriptorCache;
    return (cache[prop] ||
        (cache[prop] = {
            configurable: true,
            enumerable: enumerable,
            get: function () {
                initializeInstance(this);
                return this[prop];
            },
            set: function (value) {
                initializeInstance(this);
                this[prop] = value;
            }
        }));
}
function initializeInstance(target) {
    var e_1, _a;
    if (target[mobxDidRunLazyInitializersSymbol] === true)
        return;
    var decorators = target[mobxPendingDecorators];
    if (decorators) {
        addHiddenProp(target, mobxDidRunLazyInitializersSymbol, true);
        // Build property key array from both strings and symbols
        var keys = __spread(Object.getOwnPropertySymbols(decorators), Object.keys(decorators));
        try {
            for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                var key = keys_1_1.value;
                var d = decorators[key];
                d.propertyCreator(target, d.prop, d.descriptor, d.decoratorTarget, d.decoratorArguments);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
}
function createPropDecorator(propertyInitiallyEnumerable, propertyCreator) {
    return function decoratorFactory() {
        var decoratorArguments;
        var decorator = function decorate(target, prop, descriptor, applyImmediately
        // This is a special parameter to signal the direct application of a decorator, allow extendObservable to skip the entire type decoration part,
        // as the instance to apply the decorator to equals the target
        ) {
            if (applyImmediately === true) {
                propertyCreator(target, prop, descriptor, target, decoratorArguments);
                return null;
            }
            if (process.env.NODE_ENV !== "production" && !quacksLikeADecorator(arguments))
                fail("This function is a decorator, but it wasn't invoked like a decorator");
            if (!Object.prototype.hasOwnProperty.call(target, mobxPendingDecorators)) {
                var inheritedDecorators = target[mobxPendingDecorators];
                addHiddenProp(target, mobxPendingDecorators, __assign({}, inheritedDecorators));
            }
            target[mobxPendingDecorators][prop] = {
                prop: prop,
                propertyCreator: propertyCreator,
                descriptor: descriptor,
                decoratorTarget: target,
                decoratorArguments: decoratorArguments
            };
            return createPropertyInitializerDescriptor(prop, propertyInitiallyEnumerable);
        };
        if (quacksLikeADecorator(arguments)) {
            // @decorator
            decoratorArguments = EMPTY_ARRAY;
            return decorator.apply(null, arguments);
        }
        else {
            // @decorator(args)
            decoratorArguments = Array.prototype.slice.call(arguments);
            return decorator;
        }
    };
}
function quacksLikeADecorator(args) {
    return (((args.length === 2 || args.length === 3) &&
        (typeof args[1] === "string" || typeof args[1] === "symbol")) ||
        (args.length === 4 && args[3] === true));
}

function deepEnhancer(v, _, name) {
    // it is an observable already, done
    if (isObservable(v))
        return v;
    // something that can be converted and mutated?
    if (Array.isArray(v))
        return observable.array(v, { name: name });
    if (isPlainObject(v))
        return observable.object(v, undefined, { name: name });
    if (isES6Map(v))
        return observable.map(v, { name: name });
    if (isES6Set(v))
        return observable.set(v, { name: name });
    return v;
}
function shallowEnhancer(v, _, name) {
    if (v === undefined || v === null)
        return v;
    if (isObservableObject(v) || isObservableArray(v) || isObservableMap(v) || isObservableSet(v))
        return v;
    if (Array.isArray(v))
        return observable.array(v, { name: name, deep: false });
    if (isPlainObject(v))
        return observable.object(v, undefined, { name: name, deep: false });
    if (isES6Map(v))
        return observable.map(v, { name: name, deep: false });
    if (isES6Set(v))
        return observable.set(v, { name: name, deep: false });
    return fail(process.env.NODE_ENV !== "production" &&
        "The shallow modifier / decorator can only used in combination with arrays, objects, maps and sets");
}
function referenceEnhancer(newValue) {
    // never turn into an observable
    return newValue;
}
function refStructEnhancer(v, oldValue, name) {
    if (process.env.NODE_ENV !== "production" && isObservable(v))
        throw "observable.struct should not be used with observable values";
    if (deepEqual(v, oldValue))
        return oldValue;
    return v;
}

function createDecoratorForEnhancer(enhancer) {
    invariant(enhancer);
    var decorator = createPropDecorator(true, function (target, propertyName, descriptor, _decoratorTarget, decoratorArgs) {
        if (process.env.NODE_ENV !== "production") {
            invariant(!descriptor || !descriptor.get, "@observable cannot be used on getter (property \"" + stringifyKey(propertyName) + "\"), use @computed instead.");
        }
        var initialValue = descriptor
            ? descriptor.initializer
                ? descriptor.initializer.call(target)
                : descriptor.value
            : undefined;
        asObservableObject(target).addObservableProp(propertyName, initialValue, enhancer);
    });
    var res = 
    // Extra process checks, as this happens during module initialization
    typeof process !== "undefined" && process.env && process.env.NODE_ENV !== "production"
        ? function observableDecorator() {
            // This wrapper function is just to detect illegal decorator invocations, deprecate in a next version
            // and simply return the created prop decorator
            if (arguments.length < 2)
                return fail("Incorrect decorator invocation. @observable decorator doesn't expect any arguments");
            return decorator.apply(null, arguments);
        }
        : decorator;
    res.enhancer = enhancer;
    return res;
}

// Predefined bags of create observable options, to avoid allocating temporarily option objects
// in the majority of cases
var defaultCreateObservableOptions = {
    deep: true,
    name: undefined,
    defaultDecorator: undefined,
    proxy: true
};
Object.freeze(defaultCreateObservableOptions);
function assertValidOption(key) {
    if (!/^(deep|name|equals|defaultDecorator|proxy)$/.test(key))
        fail("invalid option for (extend)observable: " + key);
}
function asCreateObservableOptions(thing) {
    if (thing === null || thing === undefined)
        return defaultCreateObservableOptions;
    if (typeof thing === "string")
        return { name: thing, deep: true, proxy: true };
    if (process.env.NODE_ENV !== "production") {
        if (typeof thing !== "object")
            return fail("expected options object");
        Object.keys(thing).forEach(assertValidOption);
    }
    return thing;
}
var deepDecorator = createDecoratorForEnhancer(deepEnhancer);
var shallowDecorator = createDecoratorForEnhancer(shallowEnhancer);
var refDecorator = createDecoratorForEnhancer(referenceEnhancer);
var refStructDecorator = createDecoratorForEnhancer(refStructEnhancer);
function getEnhancerFromOptions(options) {
    return options.defaultDecorator
        ? options.defaultDecorator.enhancer
        : options.deep === false
            ? referenceEnhancer
            : deepEnhancer;
}
/**
 * Turns an object, array or function into a reactive structure.
 * @param v the value which should become observable.
 */
function createObservable(v, arg2, arg3) {
    // @observable someProp;
    if (typeof arguments[1] === "string" || typeof arguments[1] === "symbol") {
        return deepDecorator.apply(null, arguments);
    }
    // it is an observable already, done
    if (isObservable(v))
        return v;
    // something that can be converted and mutated?
    var res = isPlainObject(v)
        ? observable.object(v, arg2, arg3)
        : Array.isArray(v)
            ? observable.array(v, arg2)
            : isES6Map(v)
                ? observable.map(v, arg2)
                : isES6Set(v)
                    ? observable.set(v, arg2)
                    : v;
    // this value could be converted to a new observable data structure, return it
    if (res !== v)
        return res;
    // otherwise, just box it
    fail(process.env.NODE_ENV !== "production" &&
        "The provided value could not be converted into an observable. If you want just create an observable reference to the object use 'observable.box(value)'");
}
var observableFactories = {
    box: function (value, options) {
        if (arguments.length > 2)
            incorrectlyUsedAsDecorator("box");
        var o = asCreateObservableOptions(options);
        return new ObservableValue(value, getEnhancerFromOptions(o), o.name, true, o.equals);
    },
    array: function (initialValues, options) {
        if (arguments.length > 2)
            incorrectlyUsedAsDecorator("array");
        var o = asCreateObservableOptions(options);
        return createObservableArray(initialValues, getEnhancerFromOptions(o), o.name);
    },
    map: function (initialValues, options) {
        if (arguments.length > 2)
            incorrectlyUsedAsDecorator("map");
        var o = asCreateObservableOptions(options);
        return new ObservableMap(initialValues, getEnhancerFromOptions(o), o.name);
    },
    set: function (initialValues, options) {
        if (arguments.length > 2)
            incorrectlyUsedAsDecorator("set");
        var o = asCreateObservableOptions(options);
        return new ObservableSet(initialValues, getEnhancerFromOptions(o), o.name);
    },
    object: function (props, decorators, options) {
        if (typeof arguments[1] === "string")
            incorrectlyUsedAsDecorator("object");
        var o = asCreateObservableOptions(options);
        if (o.proxy === false) {
            return extendObservable({}, props, decorators, o);
        }
        else {
            var defaultDecorator = getDefaultDecoratorFromObjectOptions(o);
            var base = extendObservable({}, undefined, undefined, o);
            var proxy = createDynamicObservableObject(base);
            extendObservableObjectWithProperties(proxy, props, decorators, defaultDecorator);
            return proxy;
        }
    },
    ref: refDecorator,
    shallow: shallowDecorator,
    deep: deepDecorator,
    struct: refStructDecorator
};
var observable = createObservable;
// weird trick to keep our typings nicely with our funcs, and still extend the observable function
Object.keys(observableFactories).forEach(function (name) { return (observable[name] = observableFactories[name]); });
function incorrectlyUsedAsDecorator(methodName) {
    fail(
    // process.env.NODE_ENV !== "production" &&
    "Expected one or two arguments to observable." + methodName + ". Did you accidentally try to use observable." + methodName + " as decorator?");
}

var computedDecorator = createPropDecorator(false, function (instance, propertyName, descriptor, decoratorTarget, decoratorArgs) {
    var get = descriptor.get, set = descriptor.set; // initialValue is the descriptor for get / set props
    // Optimization: faster on decorator target or instance? Assuming target
    // Optimization: find out if declaring on instance isn't just faster. (also makes the property descriptor simpler). But, more memory usage..
    // Forcing instance now, fixes hot reloadig issues on React Native:
    var options = decoratorArgs[0] || {};
    asObservableObject(instance).addComputedProp(instance, propertyName, __assign({ get: get,
        set: set, context: instance }, options));
});
var computedStructDecorator = computedDecorator({ equals: comparer.structural });
/**
 * Decorator for class properties: @computed get value() { return expr; }.
 * For legacy purposes also invokable as ES5 observable created: `computed(() => expr)`;
 */
var computed = function computed(arg1, arg2, arg3) {
    if (typeof arg2 === "string") {
        // @computed
        return computedDecorator.apply(null, arguments);
    }
    if (arg1 !== null && typeof arg1 === "object" && arguments.length === 1) {
        // @computed({ options })
        return computedDecorator.apply(null, arguments);
    }
    // computed(expr, options?)
    if (process.env.NODE_ENV !== "production") {
        invariant(typeof arg1 === "function", "First argument to `computed` should be an expression.");
        invariant(arguments.length < 3, "Computed takes one or two arguments if used as function");
    }
    var opts = typeof arg2 === "object" ? arg2 : {};
    opts.get = arg1;
    opts.set = typeof arg2 === "function" ? arg2 : opts.set;
    opts.name = opts.name || arg1.name || ""; /* for generated name */
    return new ComputedValue(opts);
};
computed.struct = computedStructDecorator;

var IDerivationState;
(function (IDerivationState) {
    // before being run or (outside batch and not being observed)
    // at this point derivation is not holding any data about dependency tree
    IDerivationState[IDerivationState["NOT_TRACKING"] = -1] = "NOT_TRACKING";
    // no shallow dependency changed since last computation
    // won't recalculate derivation
    // this is what makes mobx fast
    IDerivationState[IDerivationState["UP_TO_DATE"] = 0] = "UP_TO_DATE";
    // some deep dependency changed, but don't know if shallow dependency changed
    // will require to check first if UP_TO_DATE or POSSIBLY_STALE
    // currently only ComputedValue will propagate POSSIBLY_STALE
    //
    // having this state is second big optimization:
    // don't have to recompute on every dependency change, but only when it's needed
    IDerivationState[IDerivationState["POSSIBLY_STALE"] = 1] = "POSSIBLY_STALE";
    // A shallow dependency has changed since last computation and the derivation
    // will need to recompute when it's needed next.
    IDerivationState[IDerivationState["STALE"] = 2] = "STALE";
})(IDerivationState || (IDerivationState = {}));
var TraceMode;
(function (TraceMode) {
    TraceMode[TraceMode["NONE"] = 0] = "NONE";
    TraceMode[TraceMode["LOG"] = 1] = "LOG";
    TraceMode[TraceMode["BREAK"] = 2] = "BREAK";
})(TraceMode || (TraceMode = {}));
var CaughtException = /** @class */ (function () {
    function CaughtException(cause) {
        this.cause = cause;
        // Empty
    }
    return CaughtException;
}());
function isCaughtException(e) {
    return e instanceof CaughtException;
}
/**
 * Finds out whether any dependency of the derivation has actually changed.
 * If dependenciesState is 1 then it will recalculate dependencies,
 * if any dependency changed it will propagate it by changing dependenciesState to 2.
 *
 * By iterating over the dependencies in the same order that they were reported and
 * stopping on the first change, all the recalculations are only called for ComputedValues
 * that will be tracked by derivation. That is because we assume that if the first x
 * dependencies of the derivation doesn't change then the derivation should run the same way
 * up until accessing x-th dependency.
 */
function shouldCompute(derivation) {
    switch (derivation.dependenciesState) {
        case IDerivationState.UP_TO_DATE:
            return false;
        case IDerivationState.NOT_TRACKING:
        case IDerivationState.STALE:
            return true;
        case IDerivationState.POSSIBLY_STALE: {
            // state propagation can occur outside of action/reactive context #2195
            var prevAllowStateReads = allowStateReadsStart(true);
            var prevUntracked = untrackedStart(); // no need for those computeds to be reported, they will be picked up in trackDerivedFunction.
            var obs = derivation.observing, l = obs.length;
            for (var i = 0; i < l; i++) {
                var obj = obs[i];
                if (isComputedValue(obj)) {
                    if (globalState.disableErrorBoundaries) {
                        obj.get();
                    }
                    else {
                        try {
                            obj.get();
                        }
                        catch (e) {
                            // we are not interested in the value *or* exception at this moment, but if there is one, notify all
                            untrackedEnd(prevUntracked);
                            allowStateReadsEnd(prevAllowStateReads);
                            return true;
                        }
                    }
                    // if ComputedValue `obj` actually changed it will be computed and propagated to its observers.
                    // and `derivation` is an observer of `obj`
                    // invariantShouldCompute(derivation)
                    if (derivation.dependenciesState === IDerivationState.STALE) {
                        untrackedEnd(prevUntracked);
                        allowStateReadsEnd(prevAllowStateReads);
                        return true;
                    }
                }
            }
            changeDependenciesStateTo0(derivation);
            untrackedEnd(prevUntracked);
            allowStateReadsEnd(prevAllowStateReads);
            return false;
        }
    }
}
function checkIfStateModificationsAreAllowed(atom) {
    var hasObservers = atom.observers.size > 0;
    // Should never be possible to change an observed observable from inside computed, see #798
    if (globalState.computationDepth > 0 && hasObservers)
        fail(process.env.NODE_ENV !== "production" &&
            "Computed values are not allowed to cause side effects by changing observables that are already being observed. Tried to modify: " + atom.name);
    // Should not be possible to change observed state outside strict mode, except during initialization, see #563
    if (!globalState.allowStateChanges && (hasObservers || globalState.enforceActions === "strict"))
        fail(process.env.NODE_ENV !== "production" &&
            (globalState.enforceActions
                ? "Since strict-mode is enabled, changing observed observable values outside actions is not allowed. Please wrap the code in an `action` if this change is intended. Tried to modify: "
                : "Side effects like changing state are not allowed at this point. Are you trying to modify state from, for example, the render function of a React component? Tried to modify: ") +
                atom.name);
}
function checkIfStateReadsAreAllowed(observable) {
    if (process.env.NODE_ENV !== "production" &&
        !globalState.allowStateReads &&
        globalState.observableRequiresReaction) {
        console.warn("[mobx] Observable " + observable.name + " being read outside a reactive context");
    }
}
/**
 * Executes the provided function `f` and tracks which observables are being accessed.
 * The tracking information is stored on the `derivation` object and the derivation is registered
 * as observer of any of the accessed observables.
 */
function trackDerivedFunction(derivation, f, context) {
    var prevAllowStateReads = allowStateReadsStart(true);
    // pre allocate array allocation + room for variation in deps
    // array will be trimmed by bindDependencies
    changeDependenciesStateTo0(derivation);
    derivation.newObserving = new Array(derivation.observing.length + 100);
    derivation.unboundDepsCount = 0;
    derivation.runId = ++globalState.runId;
    var prevTracking = globalState.trackingDerivation;
    globalState.trackingDerivation = derivation;
    var result;
    if (globalState.disableErrorBoundaries === true) {
        result = f.call(context);
    }
    else {
        try {
            result = f.call(context);
        }
        catch (e) {
            result = new CaughtException(e);
        }
    }
    globalState.trackingDerivation = prevTracking;
    bindDependencies(derivation);
    warnAboutDerivationWithoutDependencies(derivation);
    allowStateReadsEnd(prevAllowStateReads);
    return result;
}
function warnAboutDerivationWithoutDependencies(derivation) {
    if (process.env.NODE_ENV === "production")
        return;
    if (derivation.observing.length !== 0)
        return;
    if (globalState.reactionRequiresObservable || derivation.requiresObservable) {
        console.warn("[mobx] Derivation " + derivation.name + " is created/updated without reading any observable value");
    }
}
/**
 * diffs newObserving with observing.
 * update observing to be newObserving with unique observables
 * notify observers that become observed/unobserved
 */
function bindDependencies(derivation) {
    // invariant(derivation.dependenciesState !== IDerivationState.NOT_TRACKING, "INTERNAL ERROR bindDependencies expects derivation.dependenciesState !== -1");
    var prevObserving = derivation.observing;
    var observing = (derivation.observing = derivation.newObserving);
    var lowestNewObservingDerivationState = IDerivationState.UP_TO_DATE;
    // Go through all new observables and check diffValue: (this list can contain duplicates):
    //   0: first occurrence, change to 1 and keep it
    //   1: extra occurrence, drop it
    var i0 = 0, l = derivation.unboundDepsCount;
    for (var i = 0; i < l; i++) {
        var dep = observing[i];
        if (dep.diffValue === 0) {
            dep.diffValue = 1;
            if (i0 !== i)
                observing[i0] = dep;
            i0++;
        }
        // Upcast is 'safe' here, because if dep is IObservable, `dependenciesState` will be undefined,
        // not hitting the condition
        if (dep.dependenciesState > lowestNewObservingDerivationState) {
            lowestNewObservingDerivationState = dep.dependenciesState;
        }
    }
    observing.length = i0;
    derivation.newObserving = null; // newObserving shouldn't be needed outside tracking (statement moved down to work around FF bug, see #614)
    // Go through all old observables and check diffValue: (it is unique after last bindDependencies)
    //   0: it's not in new observables, unobserve it
    //   1: it keeps being observed, don't want to notify it. change to 0
    l = prevObserving.length;
    while (l--) {
        var dep = prevObserving[l];
        if (dep.diffValue === 0) {
            removeObserver(dep, derivation);
        }
        dep.diffValue = 0;
    }
    // Go through all new observables and check diffValue: (now it should be unique)
    //   0: it was set to 0 in last loop. don't need to do anything.
    //   1: it wasn't observed, let's observe it. set back to 0
    while (i0--) {
        var dep = observing[i0];
        if (dep.diffValue === 1) {
            dep.diffValue = 0;
            addObserver(dep, derivation);
        }
    }
    // Some new observed derivations may become stale during this derivation computation
    // so they have had no chance to propagate staleness (#916)
    if (lowestNewObservingDerivationState !== IDerivationState.UP_TO_DATE) {
        derivation.dependenciesState = lowestNewObservingDerivationState;
        derivation.onBecomeStale();
    }
}
function clearObserving(derivation) {
    // invariant(globalState.inBatch > 0, "INTERNAL ERROR clearObserving should be called only inside batch");
    var obs = derivation.observing;
    derivation.observing = [];
    var i = obs.length;
    while (i--)
        removeObserver(obs[i], derivation);
    derivation.dependenciesState = IDerivationState.NOT_TRACKING;
}
function untracked(action) {
    var prev = untrackedStart();
    try {
        return action();
    }
    finally {
        untrackedEnd(prev);
    }
}
function untrackedStart() {
    var prev = globalState.trackingDerivation;
    globalState.trackingDerivation = null;
    return prev;
}
function untrackedEnd(prev) {
    globalState.trackingDerivation = prev;
}
function allowStateReadsStart(allowStateReads) {
    var prev = globalState.allowStateReads;
    globalState.allowStateReads = allowStateReads;
    return prev;
}
function allowStateReadsEnd(prev) {
    globalState.allowStateReads = prev;
}
/**
 * needed to keep `lowestObserverState` correct. when changing from (2 or 1) to 0
 *
 */
function changeDependenciesStateTo0(derivation) {
    if (derivation.dependenciesState === IDerivationState.UP_TO_DATE)
        return;
    derivation.dependenciesState = IDerivationState.UP_TO_DATE;
    var obs = derivation.observing;
    var i = obs.length;
    while (i--)
        obs[i].lowestObserverState = IDerivationState.UP_TO_DATE;
}

// we don't use globalState for these in order to avoid possible issues with multiple
// mobx versions
var currentActionId = 0;
var nextActionId = 1;
var functionNameDescriptor = Object.getOwnPropertyDescriptor(function () { }, "name");
var isFunctionNameConfigurable = functionNameDescriptor && functionNameDescriptor.configurable;
function createAction(actionName, fn, ref) {
    if (process.env.NODE_ENV !== "production") {
        invariant(typeof fn === "function", "`action` can only be invoked on functions");
        if (typeof actionName !== "string" || !actionName)
            fail("actions should have valid names, got: '" + actionName + "'");
    }
    var res = function () {
        return executeAction(actionName, fn, ref || this, arguments);
    };
    res.isMobxAction = true;
    if (process.env.NODE_ENV !== "production") {
        if (isFunctionNameConfigurable) {
            Object.defineProperty(res, "name", { value: actionName });
        }
    }
    return res;
}
function executeAction(actionName, fn, scope, args) {
    var runInfo = _startAction(actionName, scope, args);
    try {
        return fn.apply(scope, args);
    }
    catch (err) {
        runInfo.error = err;
        throw err;
    }
    finally {
        _endAction(runInfo);
    }
}
function _startAction(actionName, scope, args) {
    var notifySpy = isSpyEnabled() && !!actionName;
    var startTime = 0;
    if (notifySpy && process.env.NODE_ENV !== "production") {
        startTime = Date.now();
        var l = (args && args.length) || 0;
        var flattendArgs = new Array(l);
        if (l > 0)
            for (var i = 0; i < l; i++)
                flattendArgs[i] = args[i];
        spyReportStart({
            type: "action",
            name: actionName,
            object: scope,
            arguments: flattendArgs
        });
    }
    var prevDerivation = untrackedStart();
    startBatch();
    var prevAllowStateChanges = allowStateChangesStart(true);
    var prevAllowStateReads = allowStateReadsStart(true);
    var runInfo = {
        prevDerivation: prevDerivation,
        prevAllowStateChanges: prevAllowStateChanges,
        prevAllowStateReads: prevAllowStateReads,
        notifySpy: notifySpy,
        startTime: startTime,
        actionId: nextActionId++,
        parentActionId: currentActionId
    };
    currentActionId = runInfo.actionId;
    return runInfo;
}
function _endAction(runInfo) {
    if (currentActionId !== runInfo.actionId) {
        fail("invalid action stack. did you forget to finish an action?");
    }
    currentActionId = runInfo.parentActionId;
    if (runInfo.error !== undefined) {
        globalState.suppressReactionErrors = true;
    }
    allowStateChangesEnd(runInfo.prevAllowStateChanges);
    allowStateReadsEnd(runInfo.prevAllowStateReads);
    endBatch();
    untrackedEnd(runInfo.prevDerivation);
    if (runInfo.notifySpy && process.env.NODE_ENV !== "production") {
        spyReportEnd({ time: Date.now() - runInfo.startTime });
    }
    globalState.suppressReactionErrors = false;
}
function allowStateChangesStart(allowStateChanges) {
    var prev = globalState.allowStateChanges;
    globalState.allowStateChanges = allowStateChanges;
    return prev;
}
function allowStateChangesEnd(prev) {
    globalState.allowStateChanges = prev;
}

var ObservableValue = /** @class */ (function (_super) {
    __extends(ObservableValue, _super);
    function ObservableValue(value, enhancer, name, notifySpy, equals) {
        if (name === void 0) { name = "ObservableValue@" + getNextId(); }
        if (notifySpy === void 0) { notifySpy = true; }
        if (equals === void 0) { equals = comparer.default; }
        var _this = _super.call(this, name) || this;
        _this.enhancer = enhancer;
        _this.name = name;
        _this.equals = equals;
        _this.hasUnreportedChange = false;
        _this.value = enhancer(value, undefined, name);
        if (notifySpy && isSpyEnabled() && process.env.NODE_ENV !== "production") {
            // only notify spy if this is a stand-alone observable
            spyReport({ type: "create", name: _this.name, newValue: "" + _this.value });
        }
        return _this;
    }
    ObservableValue.prototype.dehanceValue = function (value) {
        if (this.dehancer !== undefined)
            return this.dehancer(value);
        return value;
    };
    ObservableValue.prototype.set = function (newValue) {
        var oldValue = this.value;
        newValue = this.prepareNewValue(newValue);
        if (newValue !== globalState.UNCHANGED) {
            var notifySpy = isSpyEnabled();
            if (notifySpy && process.env.NODE_ENV !== "production") {
                spyReportStart({
                    type: "update",
                    name: this.name,
                    newValue: newValue,
                    oldValue: oldValue
                });
            }
            this.setNewValue(newValue);
            if (notifySpy && process.env.NODE_ENV !== "production")
                spyReportEnd();
        }
    };
    ObservableValue.prototype.prepareNewValue = function (newValue) {
        checkIfStateModificationsAreAllowed(this);
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                object: this,
                type: "update",
                newValue: newValue
            });
            if (!change)
                return globalState.UNCHANGED;
            newValue = change.newValue;
        }
        // apply modifier
        newValue = this.enhancer(newValue, this.value, this.name);
        return this.equals(this.value, newValue) ? globalState.UNCHANGED : newValue;
    };
    ObservableValue.prototype.setNewValue = function (newValue) {
        var oldValue = this.value;
        this.value = newValue;
        this.reportChanged();
        if (hasListeners(this)) {
            notifyListeners(this, {
                type: "update",
                object: this,
                newValue: newValue,
                oldValue: oldValue
            });
        }
    };
    ObservableValue.prototype.get = function () {
        this.reportObserved();
        return this.dehanceValue(this.value);
    };
    ObservableValue.prototype.intercept = function (handler) {
        return registerInterceptor(this, handler);
    };
    ObservableValue.prototype.observe = function (listener, fireImmediately) {
        if (fireImmediately)
            listener({
                object: this,
                type: "update",
                newValue: this.value,
                oldValue: undefined
            });
        return registerListener(this, listener);
    };
    ObservableValue.prototype.toJSON = function () {
        return this.get();
    };
    ObservableValue.prototype.toString = function () {
        return this.name + "[" + this.value + "]";
    };
    ObservableValue.prototype.valueOf = function () {
        return toPrimitive(this.get());
    };
    ObservableValue.prototype[Symbol.toPrimitive] = function () {
        return this.valueOf();
    };
    return ObservableValue;
}(Atom));
var isObservableValue = createInstanceofPredicate("ObservableValue", ObservableValue);

/**
 * A node in the state dependency root that observes other nodes, and can be observed itself.
 *
 * ComputedValue will remember the result of the computation for the duration of the batch, or
 * while being observed.
 *
 * During this time it will recompute only when one of its direct dependencies changed,
 * but only when it is being accessed with `ComputedValue.get()`.
 *
 * Implementation description:
 * 1. First time it's being accessed it will compute and remember result
 *    give back remembered result until 2. happens
 * 2. First time any deep dependency change, propagate POSSIBLY_STALE to all observers, wait for 3.
 * 3. When it's being accessed, recompute if any shallow dependency changed.
 *    if result changed: propagate STALE to all observers, that were POSSIBLY_STALE from the last step.
 *    go to step 2. either way
 *
 * If at any point it's outside batch and it isn't observed: reset everything and go to 1.
 */
var ComputedValue = /** @class */ (function () {
    /**
     * Create a new computed value based on a function expression.
     *
     * The `name` property is for debug purposes only.
     *
     * The `equals` property specifies the comparer function to use to determine if a newly produced
     * value differs from the previous value. Two comparers are provided in the library; `defaultComparer`
     * compares based on identity comparison (===), and `structualComparer` deeply compares the structure.
     * Structural comparison can be convenient if you always produce a new aggregated object and
     * don't want to notify observers if it is structurally the same.
     * This is useful for working with vectors, mouse coordinates etc.
     */
    function ComputedValue(options) {
        this.dependenciesState = IDerivationState.NOT_TRACKING;
        this.observing = []; // nodes we are looking at. Our value depends on these nodes
        this.newObserving = null; // during tracking it's an array with new observed observers
        this.isBeingObserved = false;
        this.isPendingUnobservation = false;
        this.observers = new Set();
        this.diffValue = 0;
        this.runId = 0;
        this.lastAccessedBy = 0;
        this.lowestObserverState = IDerivationState.UP_TO_DATE;
        this.unboundDepsCount = 0;
        this.__mapid = "#" + getNextId();
        this.value = new CaughtException(null);
        this.isComputing = false; // to check for cycles
        this.isRunningSetter = false;
        this.isTracing = TraceMode.NONE;
        invariant(options.get, "missing option for computed: get");
        this.derivation = options.get;
        this.name = options.name || "ComputedValue@" + getNextId();
        if (options.set)
            this.setter = createAction(this.name + "-setter", options.set);
        this.equals =
            options.equals ||
                (options.compareStructural || options.struct
                    ? comparer.structural
                    : comparer.default);
        this.scope = options.context;
        this.requiresReaction = !!options.requiresReaction;
        this.keepAlive = !!options.keepAlive;
    }
    ComputedValue.prototype.onBecomeStale = function () {
        propagateMaybeChanged(this);
    };
    ComputedValue.prototype.onBecomeObserved = function () {
        if (this.onBecomeObservedListeners) {
            this.onBecomeObservedListeners.forEach(function (listener) { return listener(); });
        }
    };
    ComputedValue.prototype.onBecomeUnobserved = function () {
        if (this.onBecomeUnobservedListeners) {
            this.onBecomeUnobservedListeners.forEach(function (listener) { return listener(); });
        }
    };
    /**
     * Returns the current value of this computed value.
     * Will evaluate its computation first if needed.
     */
    ComputedValue.prototype.get = function () {
        if (this.isComputing)
            fail("Cycle detected in computation " + this.name + ": " + this.derivation);
        if (globalState.inBatch === 0 && this.observers.size === 0 && !this.keepAlive) {
            if (shouldCompute(this)) {
                this.warnAboutUntrackedRead();
                startBatch(); // See perf test 'computed memoization'
                this.value = this.computeValue(false);
                endBatch();
            }
        }
        else {
            reportObserved(this);
            if (shouldCompute(this))
                if (this.trackAndCompute())
                    propagateChangeConfirmed(this);
        }
        var result = this.value;
        if (isCaughtException(result))
            throw result.cause;
        return result;
    };
    ComputedValue.prototype.peek = function () {
        var res = this.computeValue(false);
        if (isCaughtException(res))
            throw res.cause;
        return res;
    };
    ComputedValue.prototype.set = function (value) {
        if (this.setter) {
            invariant(!this.isRunningSetter, "The setter of computed value '" + this.name + "' is trying to update itself. Did you intend to update an _observable_ value, instead of the computed property?");
            this.isRunningSetter = true;
            try {
                this.setter.call(this.scope, value);
            }
            finally {
                this.isRunningSetter = false;
            }
        }
        else
            invariant(false, process.env.NODE_ENV !== "production" &&
                "[ComputedValue '" + this.name + "'] It is not possible to assign a new value to a computed value.");
    };
    ComputedValue.prototype.trackAndCompute = function () {
        if (isSpyEnabled() && process.env.NODE_ENV !== "production") {
            spyReport({
                object: this.scope,
                type: "compute",
                name: this.name
            });
        }
        var oldValue = this.value;
        var wasSuspended = 
        /* see #1208 */ this.dependenciesState === IDerivationState.NOT_TRACKING;
        var newValue = this.computeValue(true);
        var changed = wasSuspended ||
            isCaughtException(oldValue) ||
            isCaughtException(newValue) ||
            !this.equals(oldValue, newValue);
        if (changed) {
            this.value = newValue;
        }
        return changed;
    };
    ComputedValue.prototype.computeValue = function (track) {
        this.isComputing = true;
        globalState.computationDepth++;
        var res;
        if (track) {
            res = trackDerivedFunction(this, this.derivation, this.scope);
        }
        else {
            if (globalState.disableErrorBoundaries === true) {
                res = this.derivation.call(this.scope);
            }
            else {
                try {
                    res = this.derivation.call(this.scope);
                }
                catch (e) {
                    res = new CaughtException(e);
                }
            }
        }
        globalState.computationDepth--;
        this.isComputing = false;
        return res;
    };
    ComputedValue.prototype.suspend = function () {
        if (!this.keepAlive) {
            clearObserving(this);
            this.value = undefined; // don't hold on to computed value!
        }
    };
    ComputedValue.prototype.observe = function (listener, fireImmediately) {
        var _this = this;
        var firstTime = true;
        var prevValue = undefined;
        return autorun(function () {
            var newValue = _this.get();
            if (!firstTime || fireImmediately) {
                var prevU = untrackedStart();
                listener({
                    type: "update",
                    object: _this,
                    newValue: newValue,
                    oldValue: prevValue
                });
                untrackedEnd(prevU);
            }
            firstTime = false;
            prevValue = newValue;
        });
    };
    ComputedValue.prototype.warnAboutUntrackedRead = function () {
        if (process.env.NODE_ENV === "production")
            return;
        if (this.requiresReaction === true) {
            fail("[mobx] Computed value " + this.name + " is read outside a reactive context");
        }
        if (this.isTracing !== TraceMode.NONE) {
            console.log("[mobx.trace] '" + this.name + "' is being read outside a reactive context. Doing a full recompute");
        }
        if (globalState.computedRequiresReaction) {
            console.warn("[mobx] Computed value " + this.name + " is being read outside a reactive context. Doing a full recompute");
        }
    };
    ComputedValue.prototype.toJSON = function () {
        return this.get();
    };
    ComputedValue.prototype.toString = function () {
        return this.name + "[" + this.derivation.toString() + "]";
    };
    ComputedValue.prototype.valueOf = function () {
        return toPrimitive(this.get());
    };
    ComputedValue.prototype[Symbol.toPrimitive] = function () {
        return this.valueOf();
    };
    return ComputedValue;
}());
var isComputedValue = createInstanceofPredicate("ComputedValue", ComputedValue);
var MobXGlobals = /** @class */ (function () {
    function MobXGlobals() {
        /**
         * MobXGlobals version.
         * MobX compatiblity with other versions loaded in memory as long as this version matches.
         * It indicates that the global state still stores similar information
         *
         * N.B: this version is unrelated to the package version of MobX, and is only the version of the
         * internal state storage of MobX, and can be the same across many different package versions
         */
        this.version = 5;
        /**
         * globally unique token to signal unchanged
         */
        this.UNCHANGED = {};
        /**
         * Currently running derivation
         */
        this.trackingDerivation = null;
        /**
         * Are we running a computation currently? (not a reaction)
         */
        this.computationDepth = 0;
        /**
         * Each time a derivation is tracked, it is assigned a unique run-id
         */
        this.runId = 0;
        /**
         * 'guid' for general purpose. Will be persisted amongst resets.
         */
        this.mobxGuid = 0;
        /**
         * Are we in a batch block? (and how many of them)
         */
        this.inBatch = 0;
        /**
         * Observables that don't have observers anymore, and are about to be
         * suspended, unless somebody else accesses it in the same batch
         *
         * @type {IObservable[]}
         */
        this.pendingUnobservations = [];
        /**
         * List of scheduled, not yet executed, reactions.
         */
        this.pendingReactions = [];
        /**
         * Are we currently processing reactions?
         */
        this.isRunningReactions = false;
        /**
         * Is it allowed to change observables at this point?
         * In general, MobX doesn't allow that when running computations and React.render.
         * To ensure that those functions stay pure.
         */
        this.allowStateChanges = true;
        /**
         * Is it allowed to read observables at this point?
         * Used to hold the state needed for `observableRequiresReaction`
         */
        this.allowStateReads = true;
        /**
         * If strict mode is enabled, state changes are by default not allowed
         */
        this.enforceActions = false;
        /**
         * Spy callbacks
         */
        this.spyListeners = [];
        /**
         * Globally attached error handlers that react specifically to errors in reactions
         */
        this.globalReactionErrorHandlers = [];
        /**
         * Warn if computed values are accessed outside a reactive context
         */
        this.computedRequiresReaction = false;
        /**
         * (Experimental)
         * Warn if you try to create to derivation / reactive context without accessing any observable.
         */
        this.reactionRequiresObservable = false;
        /**
         * (Experimental)
         * Warn if observables are accessed outside a reactive context
         */
        this.observableRequiresReaction = false;
        /**
         * Allows overwriting of computed properties, useful in tests but not prod as it can cause
         * memory leaks. See https://github.com/mobxjs/mobx/issues/1867
         */
        this.computedConfigurable = false;
        /*
         * Don't catch and rethrow exceptions. This is useful for inspecting the state of
         * the stack when an exception occurs while debugging.
         */
        this.disableErrorBoundaries = false;
        /*
         * If true, we are already handling an exception in an action. Any errors in reactions should be suppressed, as
         * they are not the cause, see: https://github.com/mobxjs/mobx/issues/1836
         */
        this.suppressReactionErrors = false;
    }
    return MobXGlobals;
}());
var mockGlobal = {};
function getGlobal() {
    if (typeof window !== "undefined") {
        return window;
    }
    if (typeof global !== "undefined") {
        return global;
    }
    if (typeof self !== "undefined") {
        return self;
    }
    return mockGlobal;
}
var canMergeGlobalState = true;
var isolateCalled = false;
var globalState = (function () {
    var global = getGlobal();
    if (global.__mobxInstanceCount > 0 && !global.__mobxGlobals)
        canMergeGlobalState = false;
    if (global.__mobxGlobals && global.__mobxGlobals.version !== new MobXGlobals().version)
        canMergeGlobalState = false;
    if (!canMergeGlobalState) {
        setTimeout(function () {
            if (!isolateCalled) {
                fail("There are multiple, different versions of MobX active. Make sure MobX is loaded only once or use `configure({ isolateGlobalState: true })`");
            }
        }, 1);
        return new MobXGlobals();
    }
    else if (global.__mobxGlobals) {
        global.__mobxInstanceCount += 1;
        if (!global.__mobxGlobals.UNCHANGED)
            global.__mobxGlobals.UNCHANGED = {}; // make merge backward compatible
        return global.__mobxGlobals;
    }
    else {
        global.__mobxInstanceCount = 1;
        return (global.__mobxGlobals = new MobXGlobals());
    }
})();
function isolateGlobalState() {
    if (globalState.pendingReactions.length ||
        globalState.inBatch ||
        globalState.isRunningReactions)
        fail("isolateGlobalState should be called before MobX is running any reactions");
    isolateCalled = true;
    if (canMergeGlobalState) {
        if (--getGlobal().__mobxInstanceCount === 0)
            getGlobal().__mobxGlobals = undefined;
        globalState = new MobXGlobals();
    }
}
// function invariantObservers(observable: IObservable) {
//     const list = observable.observers
//     const map = observable.observersIndexes
//     const l = list.length
//     for (let i = 0; i < l; i++) {
//         const id = list[i].__mapid
//         if (i) {
//             invariant(map[id] === i, "INTERNAL ERROR maps derivation.__mapid to index in list") // for performance
//         } else {
//             invariant(!(id in map), "INTERNAL ERROR observer on index 0 shouldn't be held in map.") // for performance
//         }
//     }
//     invariant(
//         list.length === 0 || Object.keys(map).length === list.length - 1,
//         "INTERNAL ERROR there is no junk in map"
//     )
// }
function addObserver(observable, node) {
    // invariant(node.dependenciesState !== -1, "INTERNAL ERROR, can add only dependenciesState !== -1");
    // invariant(observable._observers.indexOf(node) === -1, "INTERNAL ERROR add already added node");
    // invariantObservers(observable);
    observable.observers.add(node);
    if (observable.lowestObserverState > node.dependenciesState)
        observable.lowestObserverState = node.dependenciesState;
    // invariantObservers(observable);
    // invariant(observable._observers.indexOf(node) !== -1, "INTERNAL ERROR didn't add node");
}
function removeObserver(observable, node) {
    // invariant(globalState.inBatch > 0, "INTERNAL ERROR, remove should be called only inside batch");
    // invariant(observable._observers.indexOf(node) !== -1, "INTERNAL ERROR remove already removed node");
    // invariantObservers(observable);
    observable.observers.delete(node);
    if (observable.observers.size === 0) {
        // deleting last observer
        queueForUnobservation(observable);
    }
    // invariantObservers(observable);
    // invariant(observable._observers.indexOf(node) === -1, "INTERNAL ERROR remove already removed node2");
}
function queueForUnobservation(observable) {
    if (observable.isPendingUnobservation === false) {
        // invariant(observable._observers.length === 0, "INTERNAL ERROR, should only queue for unobservation unobserved observables");
        observable.isPendingUnobservation = true;
        globalState.pendingUnobservations.push(observable);
    }
}
/**
 * Batch starts a transaction, at least for purposes of memoizing ComputedValues when nothing else does.
 * During a batch `onBecomeUnobserved` will be called at most once per observable.
 * Avoids unnecessary recalculations.
 */
function startBatch() {
    globalState.inBatch++;
}
function endBatch() {
    if (--globalState.inBatch === 0) {
        runReactions();
        // the batch is actually about to finish, all unobserving should happen here.
        var list = globalState.pendingUnobservations;
        for (var i = 0; i < list.length; i++) {
            var observable = list[i];
            observable.isPendingUnobservation = false;
            if (observable.observers.size === 0) {
                if (observable.isBeingObserved) {
                    // if this observable had reactive observers, trigger the hooks
                    observable.isBeingObserved = false;
                    observable.onBecomeUnobserved();
                }
                if (observable instanceof ComputedValue) {
                    // computed values are automatically teared down when the last observer leaves
                    // this process happens recursively, this computed might be the last observabe of another, etc..
                    observable.suspend();
                }
            }
        }
        globalState.pendingUnobservations = [];
    }
}
function reportObserved(observable) {
    checkIfStateReadsAreAllowed(observable);
    var derivation = globalState.trackingDerivation;
    if (derivation !== null) {
        /**
         * Simple optimization, give each derivation run an unique id (runId)
         * Check if last time this observable was accessed the same runId is used
         * if this is the case, the relation is already known
         */
        if (derivation.runId !== observable.lastAccessedBy) {
            observable.lastAccessedBy = derivation.runId;
            // Tried storing newObserving, or observing, or both as Set, but performance didn't come close...
            derivation.newObserving[derivation.unboundDepsCount++] = observable;
            if (!observable.isBeingObserved) {
                observable.isBeingObserved = true;
                observable.onBecomeObserved();
            }
        }
        return true;
    }
    else if (observable.observers.size === 0 && globalState.inBatch > 0) {
        queueForUnobservation(observable);
    }
    return false;
}
// function invariantLOS(observable: IObservable, msg: string) {
//     // it's expensive so better not run it in produciton. but temporarily helpful for testing
//     const min = getObservers(observable).reduce((a, b) => Math.min(a, b.dependenciesState), 2)
//     if (min >= observable.lowestObserverState) return // <- the only assumption about `lowestObserverState`
//     throw new Error(
//         "lowestObserverState is wrong for " +
//             msg +
//             " because " +
//             min +
//             " < " +
//             observable.lowestObserverState
//     )
// }
/**
 * NOTE: current propagation mechanism will in case of self reruning autoruns behave unexpectedly
 * It will propagate changes to observers from previous run
 * It's hard or maybe impossible (with reasonable perf) to get it right with current approach
 * Hopefully self reruning autoruns aren't a feature people should depend on
 * Also most basic use cases should be ok
 */
// Called by Atom when its value changes
function propagateChanged(observable) {
    // invariantLOS(observable, "changed start");
    if (observable.lowestObserverState === IDerivationState.STALE)
        return;
    observable.lowestObserverState = IDerivationState.STALE;
    // Ideally we use for..of here, but the downcompiled version is really slow...
    observable.observers.forEach(function (d) {
        if (d.dependenciesState === IDerivationState.UP_TO_DATE) {
            if (d.isTracing !== TraceMode.NONE) {
                logTraceInfo(d, observable);
            }
            d.onBecomeStale();
        }
        d.dependenciesState = IDerivationState.STALE;
    });
    // invariantLOS(observable, "changed end");
}
// Called by ComputedValue when it recalculate and its value changed
function propagateChangeConfirmed(observable) {
    // invariantLOS(observable, "confirmed start");
    if (observable.lowestObserverState === IDerivationState.STALE)
        return;
    observable.lowestObserverState = IDerivationState.STALE;
    observable.observers.forEach(function (d) {
        if (d.dependenciesState === IDerivationState.POSSIBLY_STALE)
            d.dependenciesState = IDerivationState.STALE;
        else if (d.dependenciesState === IDerivationState.UP_TO_DATE // this happens during computing of `d`, just keep lowestObserverState up to date.
        )
            observable.lowestObserverState = IDerivationState.UP_TO_DATE;
    });
    // invariantLOS(observable, "confirmed end");
}
// Used by computed when its dependency changed, but we don't wan't to immediately recompute.
function propagateMaybeChanged(observable) {
    // invariantLOS(observable, "maybe start");
    if (observable.lowestObserverState !== IDerivationState.UP_TO_DATE)
        return;
    observable.lowestObserverState = IDerivationState.POSSIBLY_STALE;
    observable.observers.forEach(function (d) {
        if (d.dependenciesState === IDerivationState.UP_TO_DATE) {
            d.dependenciesState = IDerivationState.POSSIBLY_STALE;
            if (d.isTracing !== TraceMode.NONE) {
                logTraceInfo(d, observable);
            }
            d.onBecomeStale();
        }
    });
    // invariantLOS(observable, "maybe end");
}
function logTraceInfo(derivation, observable) {
    console.log("[mobx.trace] '" + derivation.name + "' is invalidated due to a change in: '" + observable.name + "'");
    if (derivation.isTracing === TraceMode.BREAK) {
        var lines = [];
        printDepTree(getDependencyTree(derivation), lines, 1);
        // prettier-ignore
        new Function("debugger;\n/*\nTracing '" + derivation.name + "'\n\nYou are entering this break point because derivation '" + derivation.name + "' is being traced and '" + observable.name + "' is now forcing it to update.\nJust follow the stacktrace you should now see in the devtools to see precisely what piece of your code is causing this update\nThe stackframe you are looking for is at least ~6-8 stack-frames up.\n\n" + (derivation instanceof ComputedValue ? derivation.derivation.toString().replace(/[*]\//g, "/") : "") + "\n\nThe dependencies for this derivation are:\n\n" + lines.join("\n") + "\n*/\n    ")();
    }
}
function printDepTree(tree, lines, depth) {
    if (lines.length >= 1000) {
        lines.push("(and many more)");
        return;
    }
    lines.push("" + new Array(depth).join("\t") + tree.name); // MWE: not the fastest, but the easiest way :)
    if (tree.dependencies)
        tree.dependencies.forEach(function (child) { return printDepTree(child, lines, depth + 1); });
}

var Reaction = /** @class */ (function () {
    function Reaction(name, onInvalidate, errorHandler, requiresObservable) {
        if (name === void 0) { name = "Reaction@" + getNextId(); }
        if (requiresObservable === void 0) { requiresObservable = false; }
        this.name = name;
        this.onInvalidate = onInvalidate;
        this.errorHandler = errorHandler;
        this.requiresObservable = requiresObservable;
        this.observing = []; // nodes we are looking at. Our value depends on these nodes
        this.newObserving = [];
        this.dependenciesState = IDerivationState.NOT_TRACKING;
        this.diffValue = 0;
        this.runId = 0;
        this.unboundDepsCount = 0;
        this.__mapid = "#" + getNextId();
        this.isDisposed = false;
        this._isScheduled = false;
        this._isTrackPending = false;
        this._isRunning = false;
        this.isTracing = TraceMode.NONE;
    }
    Reaction.prototype.onBecomeStale = function () {
        this.schedule();
    };
    Reaction.prototype.schedule = function () {
        if (!this._isScheduled) {
            this._isScheduled = true;
            globalState.pendingReactions.push(this);
            runReactions();
        }
    };
    Reaction.prototype.isScheduled = function () {
        return this._isScheduled;
    };
    /**
     * internal, use schedule() if you intend to kick off a reaction
     */
    Reaction.prototype.runReaction = function () {
        if (!this.isDisposed) {
            startBatch();
            this._isScheduled = false;
            if (shouldCompute(this)) {
                this._isTrackPending = true;
                try {
                    this.onInvalidate();
                    if (this._isTrackPending &&
                        isSpyEnabled() &&
                        process.env.NODE_ENV !== "production") {
                        // onInvalidate didn't trigger track right away..
                        spyReport({
                            name: this.name,
                            type: "scheduled-reaction"
                        });
                    }
                }
                catch (e) {
                    this.reportExceptionInDerivation(e);
                }
            }
            endBatch();
        }
    };
    Reaction.prototype.track = function (fn) {
        if (this.isDisposed) {
            return;
            // console.warn("Reaction already disposed") // Note: Not a warning / error in mobx 4 either
        }
        startBatch();
        var notify = isSpyEnabled();
        var startTime;
        if (notify && process.env.NODE_ENV !== "production") {
            startTime = Date.now();
            spyReportStart({
                name: this.name,
                type: "reaction"
            });
        }
        this._isRunning = true;
        var result = trackDerivedFunction(this, fn, undefined);
        this._isRunning = false;
        this._isTrackPending = false;
        if (this.isDisposed) {
            // disposed during last run. Clean up everything that was bound after the dispose call.
            clearObserving(this);
        }
        if (isCaughtException(result))
            this.reportExceptionInDerivation(result.cause);
        if (notify && process.env.NODE_ENV !== "production") {
            spyReportEnd({
                time: Date.now() - startTime
            });
        }
        endBatch();
    };
    Reaction.prototype.reportExceptionInDerivation = function (error) {
        var _this = this;
        if (this.errorHandler) {
            this.errorHandler(error, this);
            return;
        }
        if (globalState.disableErrorBoundaries)
            throw error;
        var message = "[mobx] Encountered an uncaught exception that was thrown by a reaction or observer component, in: '" + this + "'";
        if (globalState.suppressReactionErrors) {
            console.warn("[mobx] (error in reaction '" + this.name + "' suppressed, fix error of causing action below)"); // prettier-ignore
        }
        else {
            console.error(message, error);
            /** If debugging brought you here, please, read the above message :-). Tnx! */
        }
        if (isSpyEnabled()) {
            spyReport({
                type: "error",
                name: this.name,
                message: message,
                error: "" + error
            });
        }
        globalState.globalReactionErrorHandlers.forEach(function (f) { return f(error, _this); });
    };
    Reaction.prototype.dispose = function () {
        if (!this.isDisposed) {
            this.isDisposed = true;
            if (!this._isRunning) {
                // if disposed while running, clean up later. Maybe not optimal, but rare case
                startBatch();
                clearObserving(this);
                endBatch();
            }
        }
    };
    Reaction.prototype.getDisposer = function () {
        var r = this.dispose.bind(this);
        r[$mobx] = this;
        return r;
    };
    Reaction.prototype.toString = function () {
        return "Reaction[" + this.name + "]";
    };
    Reaction.prototype.trace = function (enterBreakPoint) {
        if (enterBreakPoint === void 0) { enterBreakPoint = false; }
        trace(this, enterBreakPoint);
    };
    return Reaction;
}());
/**
 * Magic number alert!
 * Defines within how many times a reaction is allowed to re-trigger itself
 * until it is assumed that this is gonna be a never ending loop...
 */
var MAX_REACTION_ITERATIONS = 100;
var reactionScheduler = function (f) { return f(); };
function runReactions() {
    // Trampolining, if runReactions are already running, new reactions will be picked up
    if (globalState.inBatch > 0 || globalState.isRunningReactions)
        return;
    reactionScheduler(runReactionsHelper);
}
function runReactionsHelper() {
    globalState.isRunningReactions = true;
    var allReactions = globalState.pendingReactions;
    var iterations = 0;
    // While running reactions, new reactions might be triggered.
    // Hence we work with two variables and check whether
    // we converge to no remaining reactions after a while.
    while (allReactions.length > 0) {
        if (++iterations === MAX_REACTION_ITERATIONS) {
            console.error("Reaction doesn't converge to a stable state after " + MAX_REACTION_ITERATIONS + " iterations." +
                (" Probably there is a cycle in the reactive function: " + allReactions[0]));
            allReactions.splice(0); // clear reactions
        }
        var remainingReactions = allReactions.splice(0);
        for (var i = 0, l = remainingReactions.length; i < l; i++)
            remainingReactions[i].runReaction();
    }
    globalState.isRunningReactions = false;
}
var isReaction = createInstanceofPredicate("Reaction", Reaction);
function setReactionScheduler(fn) {
    var baseScheduler = reactionScheduler;
    reactionScheduler = function (f) { return fn(function () { return baseScheduler(f); }); };
}

function isSpyEnabled() {
    return process.env.NODE_ENV !== "production" && !!globalState.spyListeners.length;
}
function spyReport(event) {
    if (process.env.NODE_ENV === "production")
        return; // dead code elimination can do the rest
    if (!globalState.spyListeners.length)
        return;
    var listeners = globalState.spyListeners;
    for (var i = 0, l = listeners.length; i < l; i++)
        listeners[i](event);
}
function spyReportStart(event) {
    if (process.env.NODE_ENV === "production")
        return;
    var change = __assign(__assign({}, event), { spyReportStart: true });
    spyReport(change);
}
var END_EVENT = { spyReportEnd: true };
function spyReportEnd(change) {
    if (process.env.NODE_ENV === "production")
        return;
    if (change)
        spyReport(__assign(__assign({}, change), { spyReportEnd: true }));
    else
        spyReport(END_EVENT);
}
function spy(listener) {
    if (process.env.NODE_ENV === "production") {
        console.warn("[mobx.spy] Is a no-op in production builds");
        return function () { };
    }
    else {
        globalState.spyListeners.push(listener);
        return once(function () {
            globalState.spyListeners = globalState.spyListeners.filter(function (l) { return l !== listener; });
        });
    }
}

function dontReassignFields() {
    fail(process.env.NODE_ENV !== "production" && "@action fields are not reassignable");
}
function namedActionDecorator(name) {
    return function (target, prop, descriptor) {
        if (descriptor) {
            if (process.env.NODE_ENV !== "production" && descriptor.get !== undefined) {
                return fail("@action cannot be used with getters");
            }
            // babel / typescript
            // @action method() { }
            if (descriptor.value) {
                // typescript
                return {
                    value: createAction(name, descriptor.value),
                    enumerable: false,
                    configurable: true,
                    writable: true // for typescript, this must be writable, otherwise it cannot inherit :/ (see inheritable actions test)
                };
            }
            // babel only: @action method = () => {}
            var initializer_1 = descriptor.initializer;
            return {
                enumerable: false,
                configurable: true,
                writable: true,
                initializer: function () {
                    // N.B: we can't immediately invoke initializer; this would be wrong
                    return createAction(name, initializer_1.call(this));
                }
            };
        }
        // bound instance methods
        return actionFieldDecorator(name).apply(this, arguments);
    };
}
function actionFieldDecorator(name) {
    // Simple property that writes on first invocation to the current instance
    return function (target, prop, descriptor) {
        Object.defineProperty(target, prop, {
            configurable: true,
            enumerable: false,
            get: function () {
                return undefined;
            },
            set: function (value) {
                addHiddenProp(this, prop, action(name, value));
            }
        });
    };
}
function boundActionDecorator(target, propertyName, descriptor, applyToInstance) {
    if (applyToInstance === true) {
        defineBoundAction(target, propertyName, descriptor.value);
        return null;
    }
    if (descriptor) {
        // if (descriptor.value)
        // Typescript / Babel: @action.bound method() { }
        // also: babel @action.bound method = () => {}
        return {
            configurable: true,
            enumerable: false,
            get: function () {
                defineBoundAction(this, propertyName, descriptor.value || descriptor.initializer.call(this));
                return this[propertyName];
            },
            set: dontReassignFields
        };
    }
    // field decorator Typescript @action.bound method = () => {}
    return {
        enumerable: false,
        configurable: true,
        set: function (v) {
            defineBoundAction(this, propertyName, v);
        },
        get: function () {
            return undefined;
        }
    };
}

var action = function action(arg1, arg2, arg3, arg4) {
    // action(fn() {})
    if (arguments.length === 1 && typeof arg1 === "function")
        return createAction(arg1.name || "<unnamed action>", arg1);
    // action("name", fn() {})
    if (arguments.length === 2 && typeof arg2 === "function")
        return createAction(arg1, arg2);
    // @action("name") fn() {}
    if (arguments.length === 1 && typeof arg1 === "string")
        return namedActionDecorator(arg1);
    // @action fn() {}
    if (arg4 === true) {
        // apply to instance immediately
        addHiddenProp(arg1, arg2, createAction(arg1.name || arg2, arg3.value, this));
    }
    else {
        return namedActionDecorator(arg2).apply(null, arguments);
    }
};
action.bound = boundActionDecorator;
function runInAction(arg1, arg2) {
    var actionName = typeof arg1 === "string" ? arg1 : arg1.name || "<unnamed action>";
    var fn = typeof arg1 === "function" ? arg1 : arg2;
    if (process.env.NODE_ENV !== "production") {
        invariant(typeof fn === "function" && fn.length === 0, "`runInAction` expects a function without arguments");
        if (typeof actionName !== "string" || !actionName)
            fail("actions should have valid names, got: '" + actionName + "'");
    }
    return executeAction(actionName, fn, this, undefined);
}
function isAction(thing) {
    return typeof thing === "function" && thing.isMobxAction === true;
}
function defineBoundAction(target, propertyName, fn) {
    addHiddenProp(target, propertyName, createAction(propertyName, fn.bind(target)));
}

/**
 * Creates a named reactive view and keeps it alive, so that the view is always
 * updated if one of the dependencies changes, even when the view is not further used by something else.
 * @param view The reactive view
 * @returns disposer function, which can be used to stop the view from being updated in the future.
 */
function autorun(view, opts) {
    if (opts === void 0) { opts = EMPTY_OBJECT; }
    if (process.env.NODE_ENV !== "production") {
        invariant(typeof view === "function", "Autorun expects a function as first argument");
        invariant(isAction(view) === false, "Autorun does not accept actions since actions are untrackable");
    }
    var name = (opts && opts.name) || view.name || "Autorun@" + getNextId();
    var runSync = !opts.scheduler && !opts.delay;
    var reaction;
    if (runSync) {
        // normal autorun
        reaction = new Reaction(name, function () {
            this.track(reactionRunner);
        }, opts.onError, opts.requiresObservable);
    }
    else {
        var scheduler_1 = createSchedulerFromOptions(opts);
        // debounced autorun
        var isScheduled_1 = false;
        reaction = new Reaction(name, function () {
            if (!isScheduled_1) {
                isScheduled_1 = true;
                scheduler_1(function () {
                    isScheduled_1 = false;
                    if (!reaction.isDisposed)
                        reaction.track(reactionRunner);
                });
            }
        }, opts.onError, opts.requiresObservable);
    }
    function reactionRunner() {
        view(reaction);
    }
    reaction.schedule();
    return reaction.getDisposer();
}
var run = function (f) { return f(); };
function createSchedulerFromOptions(opts) {
    return opts.scheduler
        ? opts.scheduler
        : opts.delay
            ? function (f) { return setTimeout(f, opts.delay); }
            : run;
}
function reaction(expression, effect, opts) {
    if (opts === void 0) { opts = EMPTY_OBJECT; }
    if (process.env.NODE_ENV !== "production") {
        invariant(typeof expression === "function", "First argument to reaction should be a function");
        invariant(typeof opts === "object", "Third argument of reactions should be an object");
    }
    var name = opts.name || "Reaction@" + getNextId();
    var effectAction = action(name, opts.onError ? wrapErrorHandler(opts.onError, effect) : effect);
    var runSync = !opts.scheduler && !opts.delay;
    var scheduler = createSchedulerFromOptions(opts);
    var firstTime = true;
    var isScheduled = false;
    var value;
    var equals = opts.compareStructural
        ? comparer.structural
        : opts.equals || comparer.default;
    var r = new Reaction(name, function () {
        if (firstTime || runSync) {
            reactionRunner();
        }
        else if (!isScheduled) {
            isScheduled = true;
            scheduler(reactionRunner);
        }
    }, opts.onError, opts.requiresObservable);
    function reactionRunner() {
        isScheduled = false; // Q: move into reaction runner?
        if (r.isDisposed)
            return;
        var changed = false;
        r.track(function () {
            var nextValue = expression(r);
            changed = firstTime || !equals(value, nextValue);
            value = nextValue;
        });
        if (firstTime && opts.fireImmediately)
            effectAction(value, r);
        if (!firstTime && changed === true)
            effectAction(value, r);
        if (firstTime)
            firstTime = false;
    }
    r.schedule();
    return r.getDisposer();
}
function wrapErrorHandler(errorHandler, baseFn) {
    return function () {
        try {
            return baseFn.apply(this, arguments);
        }
        catch (e) {
            errorHandler.call(this, e);
        }
    };
}

function onBecomeObserved(thing, arg2, arg3) {
    return interceptHook("onBecomeObserved", thing, arg2, arg3);
}
function onBecomeUnobserved(thing, arg2, arg3) {
    return interceptHook("onBecomeUnobserved", thing, arg2, arg3);
}
function interceptHook(hook, thing, arg2, arg3) {
    var atom = typeof arg3 === "function" ? getAtom(thing, arg2) : getAtom(thing);
    var cb = typeof arg3 === "function" ? arg3 : arg2;
    var listenersKey = hook + "Listeners";
    if (atom[listenersKey]) {
        atom[listenersKey].add(cb);
    }
    else {
        atom[listenersKey] = new Set([cb]);
    }
    var orig = atom[hook];
    if (typeof orig !== "function")
        return fail(process.env.NODE_ENV !== "production" && "Not an atom that can be (un)observed");
    return function () {
        var hookListeners = atom[listenersKey];
        if (hookListeners) {
            hookListeners.delete(cb);
            if (hookListeners.size === 0) {
                delete atom[listenersKey];
            }
        }
    };
}

function configure(options) {
    var enforceActions = options.enforceActions, computedRequiresReaction = options.computedRequiresReaction, computedConfigurable = options.computedConfigurable, disableErrorBoundaries = options.disableErrorBoundaries, reactionScheduler = options.reactionScheduler, reactionRequiresObservable = options.reactionRequiresObservable, observableRequiresReaction = options.observableRequiresReaction;
    if (options.isolateGlobalState === true) {
        isolateGlobalState();
    }
    if (enforceActions !== undefined) {
        if (typeof enforceActions === "boolean" || enforceActions === "strict")
            deprecated("Deprecated value for 'enforceActions', use 'false' => '\"never\"', 'true' => '\"observed\"', '\"strict\"' => \"'always'\" instead");
        var ea = void 0;
        switch (enforceActions) {
            case true:
            case "observed":
                ea = true;
                break;
            case false:
            case "never":
                ea = false;
                break;
            case "strict":
            case "always":
                ea = "strict";
                break;
            default:
                fail("Invalid value for 'enforceActions': '" + enforceActions + "', expected 'never', 'always' or 'observed'");
        }
        globalState.enforceActions = ea;
        globalState.allowStateChanges = ea === true || ea === "strict" ? false : true;
    }
    if (computedRequiresReaction !== undefined) {
        globalState.computedRequiresReaction = !!computedRequiresReaction;
    }
    if (reactionRequiresObservable !== undefined) {
        globalState.reactionRequiresObservable = !!reactionRequiresObservable;
    }
    if (observableRequiresReaction !== undefined) {
        globalState.observableRequiresReaction = !!observableRequiresReaction;
        globalState.allowStateReads = !globalState.observableRequiresReaction;
    }
    if (computedConfigurable !== undefined) {
        globalState.computedConfigurable = !!computedConfigurable;
    }
    if (disableErrorBoundaries !== undefined) {
        if (disableErrorBoundaries === true)
            console.warn("WARNING: Debug feature only. MobX will NOT recover from errors when `disableErrorBoundaries` is enabled.");
        globalState.disableErrorBoundaries = !!disableErrorBoundaries;
    }
    if (reactionScheduler) {
        setReactionScheduler(reactionScheduler);
    }
}

function extendObservable(target, properties, decorators, options) {
    if (process.env.NODE_ENV !== "production") {
        invariant(arguments.length >= 2 && arguments.length <= 4, "'extendObservable' expected 2-4 arguments");
        invariant(typeof target === "object", "'extendObservable' expects an object as first argument");
        invariant(!isObservableMap(target), "'extendObservable' should not be used on maps, use map.merge instead");
    }
    options = asCreateObservableOptions(options);
    var defaultDecorator = getDefaultDecoratorFromObjectOptions(options);
    initializeInstance(target); // Fixes #1740
    asObservableObject(target, options.name, defaultDecorator.enhancer); // make sure object is observable, even without initial props
    if (properties)
        extendObservableObjectWithProperties(target, properties, decorators, defaultDecorator);
    return target;
}
function getDefaultDecoratorFromObjectOptions(options) {
    return options.defaultDecorator || (options.deep === false ? refDecorator : deepDecorator);
}
function extendObservableObjectWithProperties(target, properties, decorators, defaultDecorator) {
    var e_1, _a, e_2, _b;
    if (process.env.NODE_ENV !== "production") {
        invariant(!isObservable(properties), "Extending an object with another observable (object) is not supported. Please construct an explicit propertymap, using `toJS` if need. See issue #540");
        if (decorators) {
            var keys = getPlainObjectKeys(decorators);
            try {
                for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                    var key = keys_1_1.value;
                    if (!(key in properties))
                        fail("Trying to declare a decorator for unspecified property '" + stringifyKey(key) + "'");
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    }
    startBatch();
    try {
        var keys = getPlainObjectKeys(properties);
        try {
            for (var keys_2 = __values(keys), keys_2_1 = keys_2.next(); !keys_2_1.done; keys_2_1 = keys_2.next()) {
                var key = keys_2_1.value;
                var descriptor = Object.getOwnPropertyDescriptor(properties, key);
                if (process.env.NODE_ENV !== "production") {
                    if (!isPlainObject(properties))
                        fail("'extendObservabe' only accepts plain objects as second argument");
                    if (isComputed(descriptor.value))
                        fail("Passing a 'computed' as initial property value is no longer supported by extendObservable. Use a getter or decorator instead");
                }
                var decorator = decorators && key in decorators
                    ? decorators[key]
                    : descriptor.get
                        ? computedDecorator
                        : defaultDecorator;
                if (process.env.NODE_ENV !== "production" && typeof decorator !== "function")
                    fail("Not a valid decorator for '" + stringifyKey(key) + "', got: " + decorator);
                var resultDescriptor = decorator(target, key, descriptor, true);
                if (resultDescriptor // otherwise, assume already applied, due to `applyToInstance`
                )
                    Object.defineProperty(target, key, resultDescriptor);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (keys_2_1 && !keys_2_1.done && (_b = keys_2.return)) _b.call(keys_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
    finally {
        endBatch();
    }
}

function getDependencyTree(thing, property) {
    return nodeToDependencyTree(getAtom(thing, property));
}
function nodeToDependencyTree(node) {
    var result = {
        name: node.name
    };
    if (node.observing && node.observing.length > 0)
        result.dependencies = unique(node.observing).map(nodeToDependencyTree);
    return result;
}

function _isComputed(value, property) {
    if (value === null || value === undefined)
        return false;
    if (property !== undefined) {
        if (isObservableObject(value) === false)
            return false;
        if (!value[$mobx].values.has(property))
            return false;
        var atom = getAtom(value, property);
        return isComputedValue(atom);
    }
    return isComputedValue(value);
}
function isComputed(value) {
    if (arguments.length > 1)
        return fail(process.env.NODE_ENV !== "production" &&
            "isComputed expects only 1 argument. Use isObservableProp to inspect the observability of a property");
    return _isComputed(value);
}

function _isObservable(value, property) {
    if (value === null || value === undefined)
        return false;
    if (property !== undefined) {
        if (process.env.NODE_ENV !== "production" &&
            (isObservableMap(value) || isObservableArray(value)))
            return fail("isObservable(object, propertyName) is not supported for arrays and maps. Use map.has or array.length instead.");
        if (isObservableObject(value)) {
            return value[$mobx].values.has(property);
        }
        return false;
    }
    // For first check, see #701
    return (isObservableObject(value) ||
        !!value[$mobx] ||
        isAtom(value) ||
        isReaction(value) ||
        isComputedValue(value));
}
function isObservable(value) {
    if (arguments.length !== 1)
        fail(process.env.NODE_ENV !== "production" &&
            "isObservable expects only 1 argument. Use isObservableProp to inspect the observability of a property");
    return _isObservable(value);
}
function set(obj, key, value) {
    if (arguments.length === 2 && !isObservableSet(obj)) {
        startBatch();
        var values_1 = key;
        try {
            for (var key_1 in values_1)
                set(obj, key_1, values_1[key_1]);
        }
        finally {
            endBatch();
        }
        return;
    }
    if (isObservableObject(obj)) {
        var adm = obj[$mobx];
        var existingObservable = adm.values.get(key);
        if (existingObservable) {
            adm.write(key, value);
        }
        else {
            adm.addObservableProp(key, value, adm.defaultEnhancer);
        }
    }
    else if (isObservableMap(obj)) {
        obj.set(key, value);
    }
    else if (isObservableSet(obj)) {
        obj.add(key);
    }
    else if (isObservableArray(obj)) {
        if (typeof key !== "number")
            key = parseInt(key, 10);
        invariant(key >= 0, "Not a valid index: '" + key + "'");
        startBatch();
        if (key >= obj.length)
            obj.length = key + 1;
        obj[key] = value;
        endBatch();
    }
    else {
        return fail(process.env.NODE_ENV !== "production" &&
            "'set()' can only be used on observable objects, arrays and maps");
    }
}

function trace() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var enterBreakPoint = false;
    if (typeof args[args.length - 1] === "boolean")
        enterBreakPoint = args.pop();
    var derivation = getAtomFromArgs(args);
    if (!derivation) {
        return fail(process.env.NODE_ENV !== "production" &&
            "'trace(break?)' can only be used inside a tracked computed value or a Reaction. Consider passing in the computed value or reaction explicitly");
    }
    if (derivation.isTracing === TraceMode.NONE) {
        console.log("[mobx.trace] '" + derivation.name + "' tracing enabled");
    }
    derivation.isTracing = enterBreakPoint ? TraceMode.BREAK : TraceMode.LOG;
}
function getAtomFromArgs(args) {
    switch (args.length) {
        case 0:
            return globalState.trackingDerivation;
        case 1:
            return getAtom(args[0]);
        case 2:
            return getAtom(args[0], args[1]);
    }
}

/**
 * During a transaction no views are updated until the end of the transaction.
 * The transaction will be run synchronously nonetheless.
 *
 * @param action a function that updates some reactive state
 * @returns any value that was returned by the 'action' parameter.
 */
function transaction(action, thisArg) {
    if (thisArg === void 0) { thisArg = undefined; }
    startBatch();
    try {
        return action.apply(thisArg);
    }
    finally {
        endBatch();
    }
}

function getAdm(target) {
    return target[$mobx];
}
function isPropertyKey(val) {
    return typeof val === "string" || typeof val === "number" || typeof val === "symbol";
}
// Optimization: we don't need the intermediate objects and could have a completely custom administration for DynamicObjects,
// and skip either the internal values map, or the base object with its property descriptors!
var objectProxyTraps = {
    has: function (target, name) {
        if (name === $mobx || name === "constructor" || name === mobxDidRunLazyInitializersSymbol)
            return true;
        var adm = getAdm(target);
        // MWE: should `in` operator be reactive? If not, below code path will be faster / more memory efficient
        // TODO: check performance stats!
        // if (adm.values.get(name as string)) return true
        if (isPropertyKey(name))
            return adm.has(name);
        return name in target;
    },
    get: function (target, name) {
        if (name === $mobx || name === "constructor" || name === mobxDidRunLazyInitializersSymbol)
            return target[name];
        var adm = getAdm(target);
        var observable = adm.values.get(name);
        if (observable instanceof Atom) {
            var result = observable.get();
            if (result === undefined) {
                // This fixes #1796, because deleting a prop that has an
                // undefined value won't retrigger a observer (no visible effect),
                // the autorun wouldn't subscribe to future key changes (see also next comment)
                adm.has(name);
            }
            return result;
        }
        // make sure we start listening to future keys
        // note that we only do this here for optimization
        if (isPropertyKey(name))
            adm.has(name);
        return target[name];
    },
    set: function (target, name, value) {
        if (!isPropertyKey(name))
            return false;
        set(target, name, value);
        return true;
    },
    deleteProperty: function (target, name) {
        if (!isPropertyKey(name))
            return false;
        var adm = getAdm(target);
        adm.remove(name);
        return true;
    },
    ownKeys: function (target) {
        var adm = getAdm(target);
        adm.keysAtom.reportObserved();
        return Reflect.ownKeys(target);
    },
    preventExtensions: function (target) {
        fail("Dynamic observable objects cannot be frozen");
        return false;
    }
};
function createDynamicObservableObject(base) {
    var proxy = new Proxy(base, objectProxyTraps);
    base[$mobx].proxy = proxy;
    return proxy;
}

function hasInterceptors(interceptable) {
    return interceptable.interceptors !== undefined && interceptable.interceptors.length > 0;
}
function registerInterceptor(interceptable, handler) {
    var interceptors = interceptable.interceptors || (interceptable.interceptors = []);
    interceptors.push(handler);
    return once(function () {
        var idx = interceptors.indexOf(handler);
        if (idx !== -1)
            interceptors.splice(idx, 1);
    });
}
function interceptChange(interceptable, change) {
    var prevU = untrackedStart();
    try {
        // Interceptor can modify the array, copy it to avoid concurrent modification, see #1950
        var interceptors = __spread((interceptable.interceptors || []));
        for (var i = 0, l = interceptors.length; i < l; i++) {
            change = interceptors[i](change);
            invariant(!change || change.type, "Intercept handlers should return nothing or a change object");
            if (!change)
                break;
        }
        return change;
    }
    finally {
        untrackedEnd(prevU);
    }
}

function hasListeners(listenable) {
    return listenable.changeListeners !== undefined && listenable.changeListeners.length > 0;
}
function registerListener(listenable, handler) {
    var listeners = listenable.changeListeners || (listenable.changeListeners = []);
    listeners.push(handler);
    return once(function () {
        var idx = listeners.indexOf(handler);
        if (idx !== -1)
            listeners.splice(idx, 1);
    });
}
function notifyListeners(listenable, change) {
    var prevU = untrackedStart();
    var listeners = listenable.changeListeners;
    if (!listeners)
        return;
    listeners = listeners.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
        listeners[i](change);
    }
    untrackedEnd(prevU);
}

var MAX_SPLICE_SIZE = 10000; // See e.g. https://github.com/mobxjs/mobx/issues/859
var arrayTraps = {
    get: function (target, name) {
        if (name === $mobx)
            return target[$mobx];
        if (name === "length")
            return target[$mobx].getArrayLength();
        if (typeof name === "number") {
            return arrayExtensions.get.call(target, name);
        }
        if (typeof name === "string" && !isNaN(name)) {
            return arrayExtensions.get.call(target, parseInt(name));
        }
        if (arrayExtensions.hasOwnProperty(name)) {
            return arrayExtensions[name];
        }
        return target[name];
    },
    set: function (target, name, value) {
        if (name === "length") {
            target[$mobx].setArrayLength(value);
        }
        if (typeof name === "number") {
            arrayExtensions.set.call(target, name, value);
        }
        if (typeof name === "symbol" || isNaN(name)) {
            target[name] = value;
        }
        else {
            // numeric string
            arrayExtensions.set.call(target, parseInt(name), value);
        }
        return true;
    },
    preventExtensions: function (target) {
        fail("Observable arrays cannot be frozen");
        return false;
    }
};
function createObservableArray(initialValues, enhancer, name, owned) {
    if (name === void 0) { name = "ObservableArray@" + getNextId(); }
    if (owned === void 0) { owned = false; }
    var adm = new ObservableArrayAdministration(name, enhancer, owned);
    addHiddenFinalProp(adm.values, $mobx, adm);
    var proxy = new Proxy(adm.values, arrayTraps);
    adm.proxy = proxy;
    if (initialValues && initialValues.length) {
        var prev = allowStateChangesStart(true);
        adm.spliceWithArray(0, 0, initialValues);
        allowStateChangesEnd(prev);
    }
    return proxy;
}
var ObservableArrayAdministration = /** @class */ (function () {
    function ObservableArrayAdministration(name, enhancer, owned) {
        this.owned = owned;
        this.values = [];
        this.proxy = undefined;
        this.lastKnownLength = 0;
        this.atom = new Atom(name || "ObservableArray@" + getNextId());
        this.enhancer = function (newV, oldV) { return enhancer(newV, oldV, name + "[..]"); };
    }
    ObservableArrayAdministration.prototype.dehanceValue = function (value) {
        if (this.dehancer !== undefined)
            return this.dehancer(value);
        return value;
    };
    ObservableArrayAdministration.prototype.dehanceValues = function (values) {
        if (this.dehancer !== undefined && values.length > 0)
            return values.map(this.dehancer);
        return values;
    };
    ObservableArrayAdministration.prototype.intercept = function (handler) {
        return registerInterceptor(this, handler);
    };
    ObservableArrayAdministration.prototype.observe = function (listener, fireImmediately) {
        if (fireImmediately === void 0) { fireImmediately = false; }
        if (fireImmediately) {
            listener({
                object: this.proxy,
                type: "splice",
                index: 0,
                added: this.values.slice(),
                addedCount: this.values.length,
                removed: [],
                removedCount: 0
            });
        }
        return registerListener(this, listener);
    };
    ObservableArrayAdministration.prototype.getArrayLength = function () {
        this.atom.reportObserved();
        return this.values.length;
    };
    ObservableArrayAdministration.prototype.setArrayLength = function (newLength) {
        if (typeof newLength !== "number" || newLength < 0)
            throw new Error("[mobx.array] Out of range: " + newLength);
        var currentLength = this.values.length;
        if (newLength === currentLength)
            return;
        else if (newLength > currentLength) {
            var newItems = new Array(newLength - currentLength);
            for (var i = 0; i < newLength - currentLength; i++)
                newItems[i] = undefined; // No Array.fill everywhere...
            this.spliceWithArray(currentLength, 0, newItems);
        }
        else
            this.spliceWithArray(newLength, currentLength - newLength);
    };
    ObservableArrayAdministration.prototype.updateArrayLength = function (oldLength, delta) {
        if (oldLength !== this.lastKnownLength)
            throw new Error("[mobx] Modification exception: the internal structure of an observable array was changed.");
        this.lastKnownLength += delta;
    };
    ObservableArrayAdministration.prototype.spliceWithArray = function (index, deleteCount, newItems) {
        var _this = this;
        checkIfStateModificationsAreAllowed(this.atom);
        var length = this.values.length;
        if (index === undefined)
            index = 0;
        else if (index > length)
            index = length;
        else if (index < 0)
            index = Math.max(0, length + index);
        if (arguments.length === 1)
            deleteCount = length - index;
        else if (deleteCount === undefined || deleteCount === null)
            deleteCount = 0;
        else
            deleteCount = Math.max(0, Math.min(deleteCount, length - index));
        if (newItems === undefined)
            newItems = EMPTY_ARRAY;
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                object: this.proxy,
                type: "splice",
                index: index,
                removedCount: deleteCount,
                added: newItems
            });
            if (!change)
                return EMPTY_ARRAY;
            deleteCount = change.removedCount;
            newItems = change.added;
        }
        newItems = newItems.length === 0 ? newItems : newItems.map(function (v) { return _this.enhancer(v, undefined); });
        if (process.env.NODE_ENV !== "production") {
            var lengthDelta = newItems.length - deleteCount;
            this.updateArrayLength(length, lengthDelta); // checks if internal array wasn't modified
        }
        var res = this.spliceItemsIntoValues(index, deleteCount, newItems);
        if (deleteCount !== 0 || newItems.length !== 0)
            this.notifyArraySplice(index, newItems, res);
        return this.dehanceValues(res);
    };
    ObservableArrayAdministration.prototype.spliceItemsIntoValues = function (index, deleteCount, newItems) {
        var _a;
        if (newItems.length < MAX_SPLICE_SIZE) {
            return (_a = this.values).splice.apply(_a, __spread([index, deleteCount], newItems));
        }
        else {
            var res = this.values.slice(index, index + deleteCount);
            this.values = this.values
                .slice(0, index)
                .concat(newItems, this.values.slice(index + deleteCount));
            return res;
        }
    };
    ObservableArrayAdministration.prototype.notifyArrayChildUpdate = function (index, newValue, oldValue) {
        var notifySpy = !this.owned && isSpyEnabled();
        var notify = hasListeners(this);
        var change = notify || notifySpy
            ? {
                object: this.proxy,
                type: "update",
                index: index,
                newValue: newValue,
                oldValue: oldValue
            }
            : null;
        // The reason why this is on right hand side here (and not above), is this way the uglifier will drop it, but it won't
        // cause any runtime overhead in development mode without NODE_ENV set, unless spying is enabled
        if (notifySpy && process.env.NODE_ENV !== "production")
            spyReportStart(__assign(__assign({}, change), { name: this.atom.name }));
        this.atom.reportChanged();
        if (notify)
            notifyListeners(this, change);
        if (notifySpy && process.env.NODE_ENV !== "production")
            spyReportEnd();
    };
    ObservableArrayAdministration.prototype.notifyArraySplice = function (index, added, removed) {
        var notifySpy = !this.owned && isSpyEnabled();
        var notify = hasListeners(this);
        var change = notify || notifySpy
            ? {
                object: this.proxy,
                type: "splice",
                index: index,
                removed: removed,
                added: added,
                removedCount: removed.length,
                addedCount: added.length
            }
            : null;
        if (notifySpy && process.env.NODE_ENV !== "production")
            spyReportStart(__assign(__assign({}, change), { name: this.atom.name }));
        this.atom.reportChanged();
        // conform: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/observe
        if (notify)
            notifyListeners(this, change);
        if (notifySpy && process.env.NODE_ENV !== "production")
            spyReportEnd();
    };
    return ObservableArrayAdministration;
}());
var arrayExtensions = {
    intercept: function (handler) {
        return this[$mobx].intercept(handler);
    },
    observe: function (listener, fireImmediately) {
        if (fireImmediately === void 0) { fireImmediately = false; }
        var adm = this[$mobx];
        return adm.observe(listener, fireImmediately);
    },
    clear: function () {
        return this.splice(0);
    },
    replace: function (newItems) {
        var adm = this[$mobx];
        return adm.spliceWithArray(0, adm.values.length, newItems);
    },
    /**
     * Converts this array back to a (shallow) javascript structure.
     * For a deep clone use mobx.toJS
     */
    toJS: function () {
        return this.slice();
    },
    toJSON: function () {
        // Used by JSON.stringify
        return this.toJS();
    },
    /*
     * functions that do alter the internal structure of the array, (based on lib.es6.d.ts)
     * since these functions alter the inner structure of the array, the have side effects.
     * Because the have side effects, they should not be used in computed function,
     * and for that reason the do not call dependencyState.notifyObserved
     */
    splice: function (index, deleteCount) {
        var newItems = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            newItems[_i - 2] = arguments[_i];
        }
        var adm = this[$mobx];
        switch (arguments.length) {
            case 0:
                return [];
            case 1:
                return adm.spliceWithArray(index);
            case 2:
                return adm.spliceWithArray(index, deleteCount);
        }
        return adm.spliceWithArray(index, deleteCount, newItems);
    },
    spliceWithArray: function (index, deleteCount, newItems) {
        var adm = this[$mobx];
        return adm.spliceWithArray(index, deleteCount, newItems);
    },
    push: function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var adm = this[$mobx];
        adm.spliceWithArray(adm.values.length, 0, items);
        return adm.values.length;
    },
    pop: function () {
        return this.splice(Math.max(this[$mobx].values.length - 1, 0), 1)[0];
    },
    shift: function () {
        return this.splice(0, 1)[0];
    },
    unshift: function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var adm = this[$mobx];
        adm.spliceWithArray(0, 0, items);
        return adm.values.length;
    },
    reverse: function () {
        // reverse by default mutates in place before returning the result
        // which makes it both a 'derivation' and a 'mutation'.
        // so we deviate from the default and just make it an dervitation
        if (process.env.NODE_ENV !== "production") {
            console.warn("[mobx] `observableArray.reverse()` will not update the array in place. Use `observableArray.slice().reverse()` to suppress this warning and perform the operation on a copy, or `observableArray.replace(observableArray.slice().reverse())` to reverse & update in place");
        }
        var clone = this.slice();
        return clone.reverse.apply(clone, arguments);
    },
    sort: function (compareFn) {
        // sort by default mutates in place before returning the result
        // which goes against all good practices. Let's not change the array in place!
        if (process.env.NODE_ENV !== "production") {
            console.warn("[mobx] `observableArray.sort()` will not update the array in place. Use `observableArray.slice().sort()` to suppress this warning and perform the operation on a copy, or `observableArray.replace(observableArray.slice().sort())` to sort & update in place");
        }
        var clone = this.slice();
        return clone.sort.apply(clone, arguments);
    },
    remove: function (value) {
        var adm = this[$mobx];
        var idx = adm.dehanceValues(adm.values).indexOf(value);
        if (idx > -1) {
            this.splice(idx, 1);
            return true;
        }
        return false;
    },
    get: function (index) {
        var adm = this[$mobx];
        if (adm) {
            if (index < adm.values.length) {
                adm.atom.reportObserved();
                return adm.dehanceValue(adm.values[index]);
            }
            console.warn("[mobx.array] Attempt to read an array index (" + index + ") that is out of bounds (" + adm.values.length + "). Please check length first. Out of bound indices will not be tracked by MobX");
        }
        return undefined;
    },
    set: function (index, newValue) {
        var adm = this[$mobx];
        var values = adm.values;
        if (index < values.length) {
            // update at index in range
            checkIfStateModificationsAreAllowed(adm.atom);
            var oldValue = values[index];
            if (hasInterceptors(adm)) {
                var change = interceptChange(adm, {
                    type: "update",
                    object: adm.proxy,
                    index: index,
                    newValue: newValue
                });
                if (!change)
                    return;
                newValue = change.newValue;
            }
            newValue = adm.enhancer(newValue, oldValue);
            var changed = newValue !== oldValue;
            if (changed) {
                values[index] = newValue;
                adm.notifyArrayChildUpdate(index, newValue, oldValue);
            }
        }
        else if (index === values.length) {
            // add a new item
            adm.spliceWithArray(index, 0, [newValue]);
        }
        else {
            // out of bounds
            throw new Error("[mobx.array] Index out of bounds, " + index + " is larger than " + values.length);
        }
    }
};
[
    "concat",
    "every",
    "filter",
    "forEach",
    "indexOf",
    "join",
    "lastIndexOf",
    "map",
    "reduce",
    "reduceRight",
    "slice",
    "some",
    "toString",
    "toLocaleString"
].forEach(function (funcName) {
    arrayExtensions[funcName] = function () {
        var adm = this[$mobx];
        adm.atom.reportObserved();
        var res = adm.dehanceValues(adm.values);
        return res[funcName].apply(res, arguments);
    };
});
var isObservableArrayAdministration = createInstanceofPredicate("ObservableArrayAdministration", ObservableArrayAdministration);
function isObservableArray(thing) {
    return isObject(thing) && isObservableArrayAdministration(thing[$mobx]);
}

var _a$1;
var ObservableMapMarker = {};
// just extend Map? See also https://gist.github.com/nestharus/13b4d74f2ef4a2f4357dbd3fc23c1e54
// But: https://github.com/mobxjs/mobx/issues/1556
var ObservableMap = /** @class */ (function () {
    function ObservableMap(initialData, enhancer, name) {
        if (enhancer === void 0) { enhancer = deepEnhancer; }
        if (name === void 0) { name = "ObservableMap@" + getNextId(); }
        this.enhancer = enhancer;
        this.name = name;
        this[_a$1] = ObservableMapMarker;
        this._keysAtom = createAtom(this.name + ".keys()");
        this[Symbol.toStringTag] = "Map";
        if (typeof Map !== "function") {
            throw new Error("mobx.map requires Map polyfill for the current browser. Check babel-polyfill or core-js/es6/map.js");
        }
        this._data = new Map();
        this._hasMap = new Map();
        this.merge(initialData);
    }
    ObservableMap.prototype._has = function (key) {
        return this._data.has(key);
    };
    ObservableMap.prototype.has = function (key) {
        var _this = this;
        if (!globalState.trackingDerivation)
            return this._has(key);
        var entry = this._hasMap.get(key);
        if (!entry) {
            // todo: replace with atom (breaking change)
            var newEntry = (entry = new ObservableValue(this._has(key), referenceEnhancer, this.name + "." + stringifyKey(key) + "?", false));
            this._hasMap.set(key, newEntry);
            onBecomeUnobserved(newEntry, function () { return _this._hasMap.delete(key); });
        }
        return entry.get();
    };
    ObservableMap.prototype.set = function (key, value) {
        var hasKey = this._has(key);
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                type: hasKey ? "update" : "add",
                object: this,
                newValue: value,
                name: key
            });
            if (!change)
                return this;
            value = change.newValue;
        }
        if (hasKey) {
            this._updateValue(key, value);
        }
        else {
            this._addValue(key, value);
        }
        return this;
    };
    ObservableMap.prototype.delete = function (key) {
        var _this = this;
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                type: "delete",
                object: this,
                name: key
            });
            if (!change)
                return false;
        }
        if (this._has(key)) {
            var notifySpy = isSpyEnabled();
            var notify = hasListeners(this);
            var change = notify || notifySpy
                ? {
                    type: "delete",
                    object: this,
                    oldValue: this._data.get(key).value,
                    name: key
                }
                : null;
            if (notifySpy && process.env.NODE_ENV !== "production")
                spyReportStart(__assign(__assign({}, change), { name: this.name, key: key }));
            transaction(function () {
                _this._keysAtom.reportChanged();
                _this._updateHasMapEntry(key, false);
                var observable = _this._data.get(key);
                observable.setNewValue(undefined);
                _this._data.delete(key);
            });
            if (notify)
                notifyListeners(this, change);
            if (notifySpy && process.env.NODE_ENV !== "production")
                spyReportEnd();
            return true;
        }
        return false;
    };
    ObservableMap.prototype._updateHasMapEntry = function (key, value) {
        var entry = this._hasMap.get(key);
        if (entry) {
            entry.setNewValue(value);
        }
    };
    ObservableMap.prototype._updateValue = function (key, newValue) {
        var observable = this._data.get(key);
        newValue = observable.prepareNewValue(newValue);
        if (newValue !== globalState.UNCHANGED) {
            var notifySpy = isSpyEnabled();
            var notify = hasListeners(this);
            var change = notify || notifySpy
                ? {
                    type: "update",
                    object: this,
                    oldValue: observable.value,
                    name: key,
                    newValue: newValue
                }
                : null;
            if (notifySpy && process.env.NODE_ENV !== "production")
                spyReportStart(__assign(__assign({}, change), { name: this.name, key: key }));
            observable.setNewValue(newValue);
            if (notify)
                notifyListeners(this, change);
            if (notifySpy && process.env.NODE_ENV !== "production")
                spyReportEnd();
        }
    };
    ObservableMap.prototype._addValue = function (key, newValue) {
        var _this = this;
        checkIfStateModificationsAreAllowed(this._keysAtom);
        transaction(function () {
            var observable = new ObservableValue(newValue, _this.enhancer, _this.name + "." + stringifyKey(key), false);
            _this._data.set(key, observable);
            newValue = observable.value; // value might have been changed
            _this._updateHasMapEntry(key, true);
            _this._keysAtom.reportChanged();
        });
        var notifySpy = isSpyEnabled();
        var notify = hasListeners(this);
        var change = notify || notifySpy
            ? {
                type: "add",
                object: this,
                name: key,
                newValue: newValue
            }
            : null;
        if (notifySpy && process.env.NODE_ENV !== "production")
            spyReportStart(__assign(__assign({}, change), { name: this.name, key: key }));
        if (notify)
            notifyListeners(this, change);
        if (notifySpy && process.env.NODE_ENV !== "production")
            spyReportEnd();
    };
    ObservableMap.prototype.get = function (key) {
        if (this.has(key))
            return this.dehanceValue(this._data.get(key).get());
        return this.dehanceValue(undefined);
    };
    ObservableMap.prototype.dehanceValue = function (value) {
        if (this.dehancer !== undefined) {
            return this.dehancer(value);
        }
        return value;
    };
    ObservableMap.prototype.keys = function () {
        this._keysAtom.reportObserved();
        return this._data.keys();
    };
    ObservableMap.prototype.values = function () {
        var self = this;
        var nextIndex = 0;
        var keys = Array.from(this.keys());
        return makeIterable({
            next: function () {
                return nextIndex < keys.length
                    ? { value: self.get(keys[nextIndex++]), done: false }
                    : { done: true };
            }
        });
    };
    ObservableMap.prototype.entries = function () {
        var self = this;
        var nextIndex = 0;
        var keys = Array.from(this.keys());
        return makeIterable({
            next: function () {
                if (nextIndex < keys.length) {
                    var key = keys[nextIndex++];
                    return {
                        value: [key, self.get(key)],
                        done: false
                    };
                }
                return { done: true };
            }
        });
    };
    ObservableMap.prototype[(_a$1 = $mobx, Symbol.iterator)] = function () {
        return this.entries();
    };
    ObservableMap.prototype.forEach = function (callback, thisArg) {
        var e_1, _b;
        try {
            for (var _c = __values(this), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), key = _e[0], value = _e[1];
                callback.call(thisArg, value, key, this);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    /** Merge another object into this object, returns this. */
    ObservableMap.prototype.merge = function (other) {
        var _this = this;
        if (isObservableMap(other)) {
            other = other.toJS();
        }
        transaction(function () {
            if (isPlainObject(other))
                getPlainObjectKeys(other).forEach(function (key) { return _this.set(key, other[key]); });
            else if (Array.isArray(other))
                other.forEach(function (_b) {
                    var _c = __read(_b, 2), key = _c[0], value = _c[1];
                    return _this.set(key, value);
                });
            else if (isES6Map(other)) {
                if (other.constructor !== Map)
                    fail("Cannot initialize from classes that inherit from Map: " + other.constructor.name); // prettier-ignore
                other.forEach(function (value, key) { return _this.set(key, value); });
            }
            else if (other !== null && other !== undefined)
                fail("Cannot initialize map from " + other);
        });
        return this;
    };
    ObservableMap.prototype.clear = function () {
        var _this = this;
        transaction(function () {
            untracked(function () {
                var e_2, _b;
                try {
                    for (var _c = __values(_this.keys()), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var key = _d.value;
                        _this.delete(key);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            });
        });
    };
    ObservableMap.prototype.replace = function (values) {
        var _this = this;
        transaction(function () {
            // grab all the keys that are present in the new map but not present in the current map
            // and delete them from the map, then merge the new map
            // this will cause reactions only on changed values
            var newKeys = getMapLikeKeys(values);
            var oldKeys = Array.from(_this.keys());
            var missingKeys = oldKeys.filter(function (k) { return newKeys.indexOf(k) === -1; });
            missingKeys.forEach(function (k) { return _this.delete(k); });
            _this.merge(values);
        });
        return this;
    };
    Object.defineProperty(ObservableMap.prototype, "size", {
        get: function () {
            this._keysAtom.reportObserved();
            return this._data.size;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a plain object that represents this map.
     * Note that all the keys being stringified.
     * If there are duplicating keys after converting them to strings, behaviour is undetermined.
     */
    ObservableMap.prototype.toPOJO = function () {
        var e_3, _b;
        var res = {};
        try {
            for (var _c = __values(this), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), key = _e[0], value = _e[1];
                // We lie about symbol key types due to https://github.com/Microsoft/TypeScript/issues/1863
                res[typeof key === "symbol" ? key : stringifyKey(key)] = value;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return res;
    };
    /**
     * Returns a shallow non observable object clone of this map.
     * Note that the values migth still be observable. For a deep clone use mobx.toJS.
     */
    ObservableMap.prototype.toJS = function () {
        return new Map(this);
    };
    ObservableMap.prototype.toJSON = function () {
        // Used by JSON.stringify
        return this.toPOJO();
    };
    ObservableMap.prototype.toString = function () {
        var _this = this;
        return (this.name +
            "[{ " +
            Array.from(this.keys())
                .map(function (key) { return stringifyKey(key) + ": " + ("" + _this.get(key)); })
                .join(", ") +
            " }]");
    };
    /**
     * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
     * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
     * for callback details
     */
    ObservableMap.prototype.observe = function (listener, fireImmediately) {
        process.env.NODE_ENV !== "production" &&
            invariant(fireImmediately !== true, "`observe` doesn't support fireImmediately=true in combination with maps.");
        return registerListener(this, listener);
    };
    ObservableMap.prototype.intercept = function (handler) {
        return registerInterceptor(this, handler);
    };
    return ObservableMap;
}());
/* 'var' fixes small-build issue */
var isObservableMap = createInstanceofPredicate("ObservableMap", ObservableMap);

var _a$1$1;
var ObservableSetMarker = {};
var ObservableSet = /** @class */ (function () {
    function ObservableSet(initialData, enhancer, name) {
        if (enhancer === void 0) { enhancer = deepEnhancer; }
        if (name === void 0) { name = "ObservableSet@" + getNextId(); }
        this.name = name;
        this[_a$1$1] = ObservableSetMarker;
        this._data = new Set();
        this._atom = createAtom(this.name);
        this[Symbol.toStringTag] = "Set";
        if (typeof Set !== "function") {
            throw new Error("mobx.set requires Set polyfill for the current browser. Check babel-polyfill or core-js/es6/set.js");
        }
        this.enhancer = function (newV, oldV) { return enhancer(newV, oldV, name); };
        if (initialData) {
            this.replace(initialData);
        }
    }
    ObservableSet.prototype.dehanceValue = function (value) {
        if (this.dehancer !== undefined) {
            return this.dehancer(value);
        }
        return value;
    };
    ObservableSet.prototype.clear = function () {
        var _this = this;
        transaction(function () {
            untracked(function () {
                var e_1, _b;
                try {
                    for (var _c = __values(_this._data.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var value = _d.value;
                        _this.delete(value);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            });
        });
    };
    ObservableSet.prototype.forEach = function (callbackFn, thisArg) {
        var e_2, _b;
        try {
            for (var _c = __values(this), _d = _c.next(); !_d.done; _d = _c.next()) {
                var value = _d.value;
                callbackFn.call(thisArg, value, value, this);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    Object.defineProperty(ObservableSet.prototype, "size", {
        get: function () {
            this._atom.reportObserved();
            return this._data.size;
        },
        enumerable: true,
        configurable: true
    });
    ObservableSet.prototype.add = function (value) {
        var _this = this;
        checkIfStateModificationsAreAllowed(this._atom);
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                type: "add",
                object: this,
                newValue: value
            });
            if (!change)
                return this;
            // TODO: ideally, value = change.value would be done here, so that values can be
            // changed by interceptor. Same applies for other Set and Map api's.
        }
        if (!this.has(value)) {
            transaction(function () {
                _this._data.add(_this.enhancer(value, undefined));
                _this._atom.reportChanged();
            });
            var notifySpy = isSpyEnabled();
            var notify = hasListeners(this);
            var change = notify || notifySpy
                ? {
                    type: "add",
                    object: this,
                    newValue: value
                }
                : null;
            if (notifySpy && process.env.NODE_ENV !== "production")
                spyReportStart(change);
            if (notify)
                notifyListeners(this, change);
            if (notifySpy && process.env.NODE_ENV !== "production")
                spyReportEnd();
        }
        return this;
    };
    ObservableSet.prototype.delete = function (value) {
        var _this = this;
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                type: "delete",
                object: this,
                oldValue: value
            });
            if (!change)
                return false;
        }
        if (this.has(value)) {
            var notifySpy = isSpyEnabled();
            var notify = hasListeners(this);
            var change = notify || notifySpy
                ? {
                    type: "delete",
                    object: this,
                    oldValue: value
                }
                : null;
            if (notifySpy && process.env.NODE_ENV !== "production")
                spyReportStart(__assign(__assign({}, change), { name: this.name }));
            transaction(function () {
                _this._atom.reportChanged();
                _this._data.delete(value);
            });
            if (notify)
                notifyListeners(this, change);
            if (notifySpy && process.env.NODE_ENV !== "production")
                spyReportEnd();
            return true;
        }
        return false;
    };
    ObservableSet.prototype.has = function (value) {
        this._atom.reportObserved();
        return this._data.has(this.dehanceValue(value));
    };
    ObservableSet.prototype.entries = function () {
        var nextIndex = 0;
        var keys = Array.from(this.keys());
        var values = Array.from(this.values());
        return makeIterable({
            next: function () {
                var index = nextIndex;
                nextIndex += 1;
                return index < values.length
                    ? { value: [keys[index], values[index]], done: false }
                    : { done: true };
            }
        });
    };
    ObservableSet.prototype.keys = function () {
        return this.values();
    };
    ObservableSet.prototype.values = function () {
        this._atom.reportObserved();
        var self = this;
        var nextIndex = 0;
        var observableValues = Array.from(this._data.values());
        return makeIterable({
            next: function () {
                return nextIndex < observableValues.length
                    ? { value: self.dehanceValue(observableValues[nextIndex++]), done: false }
                    : { done: true };
            }
        });
    };
    ObservableSet.prototype.replace = function (other) {
        var _this = this;
        if (isObservableSet(other)) {
            other = other.toJS();
        }
        transaction(function () {
            if (Array.isArray(other)) {
                _this.clear();
                other.forEach(function (value) { return _this.add(value); });
            }
            else if (isES6Set(other)) {
                _this.clear();
                other.forEach(function (value) { return _this.add(value); });
            }
            else if (other !== null && other !== undefined) {
                fail("Cannot initialize set from " + other);
            }
        });
        return this;
    };
    ObservableSet.prototype.observe = function (listener, fireImmediately) {
        // TODO 'fireImmediately' can be true?
        process.env.NODE_ENV !== "production" &&
            invariant(fireImmediately !== true, "`observe` doesn't support fireImmediately=true in combination with sets.");
        return registerListener(this, listener);
    };
    ObservableSet.prototype.intercept = function (handler) {
        return registerInterceptor(this, handler);
    };
    ObservableSet.prototype.toJS = function () {
        return new Set(this);
    };
    ObservableSet.prototype.toString = function () {
        return this.name + "[ " + Array.from(this).join(", ") + " ]";
    };
    ObservableSet.prototype[(_a$1$1 = $mobx, Symbol.iterator)] = function () {
        return this.values();
    };
    return ObservableSet;
}());
var isObservableSet = createInstanceofPredicate("ObservableSet", ObservableSet);

var ObservableObjectAdministration = /** @class */ (function () {
    function ObservableObjectAdministration(target, values, name, defaultEnhancer) {
        if (values === void 0) { values = new Map(); }
        this.target = target;
        this.values = values;
        this.name = name;
        this.defaultEnhancer = defaultEnhancer;
        this.keysAtom = new Atom(name + ".keys");
    }
    ObservableObjectAdministration.prototype.read = function (key) {
        return this.values.get(key).get();
    };
    ObservableObjectAdministration.prototype.write = function (key, newValue) {
        var instance = this.target;
        var observable = this.values.get(key);
        if (observable instanceof ComputedValue) {
            observable.set(newValue);
            return;
        }
        // intercept
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                type: "update",
                object: this.proxy || instance,
                name: key,
                newValue: newValue
            });
            if (!change)
                return;
            newValue = change.newValue;
        }
        newValue = observable.prepareNewValue(newValue);
        // notify spy & observers
        if (newValue !== globalState.UNCHANGED) {
            var notify = hasListeners(this);
            var notifySpy = isSpyEnabled();
            var change = notify || notifySpy
                ? {
                    type: "update",
                    object: this.proxy || instance,
                    oldValue: observable.value,
                    name: key,
                    newValue: newValue
                }
                : null;
            if (notifySpy && process.env.NODE_ENV !== "production")
                spyReportStart(__assign(__assign({}, change), { name: this.name, key: key }));
            observable.setNewValue(newValue);
            if (notify)
                notifyListeners(this, change);
            if (notifySpy && process.env.NODE_ENV !== "production")
                spyReportEnd();
        }
    };
    ObservableObjectAdministration.prototype.has = function (key) {
        var map = this.pendingKeys || (this.pendingKeys = new Map());
        var entry = map.get(key);
        if (entry)
            return entry.get();
        else {
            var exists = !!this.values.get(key);
            // Possible optimization: Don't have a separate map for non existing keys,
            // but store them in the values map instead, using a special symbol to denote "not existing"
            entry = new ObservableValue(exists, referenceEnhancer, this.name + "." + stringifyKey(key) + "?", false);
            map.set(key, entry);
            return entry.get(); // read to subscribe
        }
    };
    ObservableObjectAdministration.prototype.addObservableProp = function (propName, newValue, enhancer) {
        if (enhancer === void 0) { enhancer = this.defaultEnhancer; }
        var target = this.target;
        assertPropertyConfigurable(target, propName);
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                object: this.proxy || target,
                name: propName,
                type: "add",
                newValue: newValue
            });
            if (!change)
                return;
            newValue = change.newValue;
        }
        var observable = new ObservableValue(newValue, enhancer, this.name + "." + stringifyKey(propName), false);
        this.values.set(propName, observable);
        newValue = observable.value; // observableValue might have changed it
        Object.defineProperty(target, propName, generateObservablePropConfig(propName));
        this.notifyPropertyAddition(propName, newValue);
    };
    ObservableObjectAdministration.prototype.addComputedProp = function (propertyOwner, // where is the property declared?
    propName, options) {
        var target = this.target;
        options.name = options.name || this.name + "." + stringifyKey(propName);
        this.values.set(propName, new ComputedValue(options));
        if (propertyOwner === target || isPropertyConfigurable(propertyOwner, propName))
            Object.defineProperty(propertyOwner, propName, generateComputedPropConfig(propName));
    };
    ObservableObjectAdministration.prototype.remove = function (key) {
        if (!this.values.has(key))
            return;
        var target = this.target;
        if (hasInterceptors(this)) {
            var change = interceptChange(this, {
                object: this.proxy || target,
                name: key,
                type: "remove"
            });
            if (!change)
                return;
        }
        try {
            startBatch();
            var notify = hasListeners(this);
            var notifySpy = isSpyEnabled();
            var oldObservable = this.values.get(key);
            var oldValue = oldObservable && oldObservable.get();
            oldObservable && oldObservable.set(undefined);
            // notify key and keyset listeners
            this.keysAtom.reportChanged();
            this.values.delete(key);
            if (this.pendingKeys) {
                var entry = this.pendingKeys.get(key);
                if (entry)
                    entry.set(false);
            }
            // delete the prop
            delete this.target[key];
            var change = notify || notifySpy
                ? {
                    type: "remove",
                    object: this.proxy || target,
                    oldValue: oldValue,
                    name: key
                }
                : null;
            if (notifySpy && process.env.NODE_ENV !== "production")
                spyReportStart(__assign(__assign({}, change), { name: this.name, key: key }));
            if (notify)
                notifyListeners(this, change);
            if (notifySpy && process.env.NODE_ENV !== "production")
                spyReportEnd();
        }
        finally {
            endBatch();
        }
    };
    ObservableObjectAdministration.prototype.illegalAccess = function (owner, propName) {
        /**
         * This happens if a property is accessed through the prototype chain, but the property was
         * declared directly as own property on the prototype.
         *
         * E.g.:
         * class A {
         * }
         * extendObservable(A.prototype, { x: 1 })
         *
         * classB extens A {
         * }
         * console.log(new B().x)
         *
         * It is unclear whether the property should be considered 'static' or inherited.
         * Either use `console.log(A.x)`
         * or: decorate(A, { x: observable })
         *
         * When using decorate, the property will always be redeclared as own property on the actual instance
         */
        console.warn("Property '" + propName + "' of '" + owner + "' was accessed through the prototype chain. Use 'decorate' instead to declare the prop or access it statically through it's owner");
    };
    /**
     * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
     * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
     * for callback details
     */
    ObservableObjectAdministration.prototype.observe = function (callback, fireImmediately) {
        process.env.NODE_ENV !== "production" &&
            invariant(fireImmediately !== true, "`observe` doesn't support the fire immediately property for observable objects.");
        return registerListener(this, callback);
    };
    ObservableObjectAdministration.prototype.intercept = function (handler) {
        return registerInterceptor(this, handler);
    };
    ObservableObjectAdministration.prototype.notifyPropertyAddition = function (key, newValue) {
        var notify = hasListeners(this);
        var notifySpy = isSpyEnabled();
        var change = notify || notifySpy
            ? {
                type: "add",
                object: this.proxy || this.target,
                name: key,
                newValue: newValue
            }
            : null;
        if (notifySpy && process.env.NODE_ENV !== "production")
            spyReportStart(__assign(__assign({}, change), { name: this.name, key: key }));
        if (notify)
            notifyListeners(this, change);
        if (notifySpy && process.env.NODE_ENV !== "production")
            spyReportEnd();
        if (this.pendingKeys) {
            var entry = this.pendingKeys.get(key);
            if (entry)
                entry.set(true);
        }
        this.keysAtom.reportChanged();
    };
    ObservableObjectAdministration.prototype.getKeys = function () {
        var e_1, _a;
        this.keysAtom.reportObserved();
        // return Reflect.ownKeys(this.values) as any
        var res = [];
        try {
            for (var _b = __values(this.values), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                if (value instanceof ObservableValue)
                    res.push(key);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return res;
    };
    return ObservableObjectAdministration;
}());
function asObservableObject(target, name, defaultEnhancer) {
    if (name === void 0) { name = ""; }
    if (defaultEnhancer === void 0) { defaultEnhancer = deepEnhancer; }
    if (Object.prototype.hasOwnProperty.call(target, $mobx))
        return target[$mobx];
    process.env.NODE_ENV !== "production" &&
        invariant(Object.isExtensible(target), "Cannot make the designated object observable; it is not extensible");
    if (!isPlainObject(target))
        name = (target.constructor.name || "ObservableObject") + "@" + getNextId();
    if (!name)
        name = "ObservableObject@" + getNextId();
    var adm = new ObservableObjectAdministration(target, new Map(), stringifyKey(name), defaultEnhancer);
    addHiddenProp(target, $mobx, adm);
    return adm;
}
var observablePropertyConfigs = Object.create(null);
var computedPropertyConfigs = Object.create(null);
function generateObservablePropConfig(propName) {
    return (observablePropertyConfigs[propName] ||
        (observablePropertyConfigs[propName] = {
            configurable: true,
            enumerable: true,
            get: function () {
                return this[$mobx].read(propName);
            },
            set: function (v) {
                this[$mobx].write(propName, v);
            }
        }));
}
function getAdministrationForComputedPropOwner(owner) {
    var adm = owner[$mobx];
    if (!adm) {
        // because computed props are declared on proty,
        // the current instance might not have been initialized yet
        initializeInstance(owner);
        return owner[$mobx];
    }
    return adm;
}
function generateComputedPropConfig(propName) {
    return (computedPropertyConfigs[propName] ||
        (computedPropertyConfigs[propName] = {
            configurable: globalState.computedConfigurable,
            enumerable: false,
            get: function () {
                return getAdministrationForComputedPropOwner(this).read(propName);
            },
            set: function (v) {
                getAdministrationForComputedPropOwner(this).write(propName, v);
            }
        }));
}
var isObservableObjectAdministration = createInstanceofPredicate("ObservableObjectAdministration", ObservableObjectAdministration);
function isObservableObject(thing) {
    if (isObject(thing)) {
        // Initializers run lazily when transpiling to babel, so make sure they are run...
        initializeInstance(thing);
        return isObservableObjectAdministration(thing[$mobx]);
    }
    return false;
}

function getAtom(thing, property) {
    if (typeof thing === "object" && thing !== null) {
        if (isObservableArray(thing)) {
            if (property !== undefined)
                fail(process.env.NODE_ENV !== "production" &&
                    "It is not possible to get index atoms from arrays");
            return thing[$mobx].atom;
        }
        if (isObservableSet(thing)) {
            return thing[$mobx];
        }
        if (isObservableMap(thing)) {
            var anyThing = thing;
            if (property === undefined)
                return anyThing._keysAtom;
            var observable = anyThing._data.get(property) || anyThing._hasMap.get(property);
            if (!observable)
                fail(process.env.NODE_ENV !== "production" &&
                    "the entry '" + property + "' does not exist in the observable map '" + getDebugName(thing) + "'");
            return observable;
        }
        // Initializers run lazily when transpiling to babel, so make sure they are run...
        initializeInstance(thing);
        if (property && !thing[$mobx])
            thing[property]; // See #1072
        if (isObservableObject(thing)) {
            if (!property)
                return fail(process.env.NODE_ENV !== "production" && "please specify a property");
            var observable = thing[$mobx].values.get(property);
            if (!observable)
                fail(process.env.NODE_ENV !== "production" &&
                    "no observable property '" + property + "' found on the observable object '" + getDebugName(thing) + "'");
            return observable;
        }
        if (isAtom(thing) || isComputedValue(thing) || isReaction(thing)) {
            return thing;
        }
    }
    else if (typeof thing === "function") {
        if (isReaction(thing[$mobx])) {
            // disposer function
            return thing[$mobx];
        }
    }
    return fail(process.env.NODE_ENV !== "production" && "Cannot obtain atom from " + thing);
}
function getAdministration(thing, property) {
    if (!thing)
        fail("Expecting some object");
    if (property !== undefined)
        return getAdministration(getAtom(thing, property));
    if (isAtom(thing) || isComputedValue(thing) || isReaction(thing))
        return thing;
    if (isObservableMap(thing) || isObservableSet(thing))
        return thing;
    // Initializers run lazily when transpiling to babel, so make sure they are run...
    initializeInstance(thing);
    if (thing[$mobx])
        return thing[$mobx];
    fail(process.env.NODE_ENV !== "production" && "Cannot obtain administration from " + thing);
}
function getDebugName(thing, property) {
    var named;
    if (property !== undefined)
        named = getAtom(thing, property);
    else if (isObservableObject(thing) || isObservableMap(thing) || isObservableSet(thing))
        named = getAdministration(thing);
    else
        named = getAtom(thing); // valid for arrays as well
    return named.name;
}

var toString = Object.prototype.toString;
function deepEqual(a, b, depth) {
    if (depth === void 0) { depth = -1; }
    return eq(a, b, depth);
}
// Copied from https://github.com/jashkenas/underscore/blob/5c237a7c682fb68fd5378203f0bf22dce1624854/underscore.js#L1186-L1289
// Internal recursive comparison function for `isEqual`.
function eq(a, b, depth, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b)
        return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null)
        return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a)
        return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== "function" && type !== "object" && typeof b != "object")
        return false;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b))
        return false;
    switch (className) {
        // Strings, numbers, regular expressions, dates, and booleans are compared by value.
        case "[object RegExp]":
        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
        case "[object String]":
            // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
            // equivalent to `new String("5")`.
            return "" + a === "" + b;
        case "[object Number]":
            // `NaN`s are equivalent, but non-reflexive.
            // Object(NaN) is equivalent to NaN.
            if (+a !== +a)
                return +b !== +b;
            // An `egal` comparison is performed for other numeric values.
            return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case "[object Date]":
        case "[object Boolean]":
            // Coerce dates and booleans to numeric primitive values. Dates are compared by their
            // millisecond representations. Note that invalid dates with millisecond representations
            // of `NaN` are not equivalent.
            return +a === +b;
        case "[object Symbol]":
            return (typeof Symbol !== "undefined" && Symbol.valueOf.call(a) === Symbol.valueOf.call(b));
        case "[object Map]":
        case "[object Set]":
            // Maps and Sets are unwrapped to arrays of entry-pairs, adding an incidental level.
            // Hide this extra level by increasing the depth.
            if (depth >= 0) {
                depth++;
            }
            break;
    }
    // Unwrap any wrapped objects.
    a = unwrap(a);
    b = unwrap(b);
    var areArrays = className === "[object Array]";
    if (!areArrays) {
        if (typeof a != "object" || typeof b != "object")
            return false;
        // Objects with different constructors are not equivalent, but `Object`s or `Array`s
        // from different frames are.
        var aCtor = a.constructor, bCtor = b.constructor;
        if (aCtor !== bCtor &&
            !(typeof aCtor === "function" &&
                aCtor instanceof aCtor &&
                typeof bCtor === "function" &&
                bCtor instanceof bCtor) &&
            ("constructor" in a && "constructor" in b)) {
            return false;
        }
    }
    if (depth === 0) {
        return false;
    }
    else if (depth < 0) {
        depth = -1;
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
        // Linear search. Performance is inversely proportional to the number of
        // unique nested structures.
        if (aStack[length] === a)
            return bStack[length] === b;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    // Recursively compare objects and arrays.
    if (areArrays) {
        // Compare array lengths to determine if a deep comparison is necessary.
        length = a.length;
        if (length !== b.length)
            return false;
        // Deep compare the contents, ignoring non-numeric properties.
        while (length--) {
            if (!eq(a[length], b[length], depth - 1, aStack, bStack))
                return false;
        }
    }
    else {
        // Deep compare objects.
        var keys = Object.keys(a);
        var key = void 0;
        length = keys.length;
        // Ensure that both objects contain the same number of properties before comparing deep equality.
        if (Object.keys(b).length !== length)
            return false;
        while (length--) {
            // Deep compare each member
            key = keys[length];
            if (!(has$1(b, key) && eq(a[key], b[key], depth - 1, aStack, bStack)))
                return false;
        }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
}
function unwrap(a) {
    if (isObservableArray(a))
        return a.slice();
    if (isES6Map(a) || isObservableMap(a))
        return Array.from(a.entries());
    if (isES6Set(a) || isObservableSet(a))
        return Array.from(a.entries());
    return a;
}
function has$1(a, key) {
    return Object.prototype.hasOwnProperty.call(a, key);
}

function makeIterable(iterator) {
    iterator[Symbol.iterator] = getSelf;
    return iterator;
}
function getSelf() {
    return this;
}

/*
The only reason for this file to exist is pure horror:
Without it rollup can make the bundling fail at any point in time; when it rolls up the files in the wrong order
it will cause undefined errors (for example because super classes or local variables not being hoisted).
With this file that will still happen,
but at least in this file we can magically reorder the imports with trial and error until the build succeeds again.
*/

/**
 * (c) Michel Weststrate 2015 - 2018
 * MIT Licensed
 *
 * Welcome to the mobx sources! To get an global overview of how MobX internally works,
 * this is a good place to start:
 * https://medium.com/@mweststrate/becoming-fully-reactive-an-in-depth-explanation-of-mobservable-55995262a254#.xvbh6qd74
 *
 * Source folders:
 * ===============
 *
 * - api/     Most of the public static methods exposed by the module can be found here.
 * - core/    Implementation of the MobX algorithm; atoms, derivations, reactions, dependency trees, optimizations. Cool stuff can be found here.
 * - types/   All the magic that is need to have observable objects, arrays and values is in this folder. Including the modifiers like `asFlat`.
 * - utils/   Utility stuff.
 *
 */
if (typeof Proxy === "undefined" || typeof Symbol === "undefined") {
    throw new Error("[mobx] MobX 5+ requires Proxy and Symbol objects. If your environment doesn't support Symbol or Proxy objects, please downgrade to MobX 4. For React Native Android, consider upgrading JSCore.");
}
try {
    // define process.env if needed
    // if this is not a production build in the first place
    // (in which case the expression below would be substituted with 'production')
    process.env.NODE_ENV;
}
catch (e) {
    var g = getGlobal();
    if (typeof process === "undefined")
        g.process = {};
    g.process.env = {};
}
(function () {
    function testCodeMinification() { }
    if (testCodeMinification.name !== "testCodeMinification" &&
        process.env.NODE_ENV !== "production" &&
        typeof process !== 'undefined' && process.env.IGNORE_MOBX_MINIFY_WARNING !== "true") {
        // trick so it doesn't get replaced
        var varName = ["process", "env", "NODE_ENV"].join(".");
        console.warn("[mobx] you are running a minified build, but '" + varName + "' was not set to 'production' in your bundler. This results in an unnecessarily large and slow bundle");
    }
})();
if (typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ === "object") {
    // See: https://github.com/andykog/mobx-devtools/
    __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
        spy: spy,
        extras: {
            getDebugName: getDebugName
        },
        $mobx: $mobx
    });
}

/*
Copyright 2018 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
const reaction$1 = Symbol('LitMobxRenderReaction');
const cachedRequestUpdate = Symbol('LitMobxRequestUpdate');
/**
 * A class mixin which can be applied to lit-element's
 * [UpdatingElement](https://lit-element.polymer-project.org/api/classes/_lib_updating_element_.updatingelement.html)
 * derived classes. This mixin adds a mobx reaction which tracks the update method of UpdatingElement.
 *
 * Any observables used in the render template of the element will be tracked by a reaction
 * and cause an update of the element upon change.
 *
 * @param constructor the constructor to extend from to add the mobx reaction, must be derived from UpdatingElement.
 */
function MobxReactionUpdate(constructor) {
    var _a, _b;
    return _b = class MobxReactingElement extends constructor {
            constructor() {
                super(...arguments);
                this[_a] = () => {
                    this.requestUpdate();
                };
            }
            connectedCallback() {
                super.connectedCallback();
                /* istanbul ignore next */
                const name = this.constructor.name || this.nodeName;
                this[reaction$1] = new Reaction(`${name}.update()`, this[cachedRequestUpdate]);
                if (this.hasUpdated)
                    this.requestUpdate();
            }
            disconnectedCallback() {
                super.disconnectedCallback();
                /* istanbul ignore else */
                if (this[reaction$1]) {
                    this[reaction$1].dispose();
                    this[reaction$1] = undefined;
                }
            }
            update(changedProperties) {
                if (this[reaction$1]) {
                    this[reaction$1].track(super.update.bind(this, changedProperties));
                }
                else {
                    super.update(changedProperties);
                }
            }
        },
        _a = cachedRequestUpdate,
        _b;
}

/*
Copyright 2018 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
/**
 * A LitElement derived class which uses the MobxReactionUpdate mixin to create a mobx
 * reactive implementation of LitElement.
 *
 * Any observables used in the render template of the element will be tracked by a reaction
 * and cause an update of the element upon change.
 */
class MobxLitElement extends MobxReactionUpdate(LitElement) {
}

var RequestStatus;
(function (RequestStatus) {
    RequestStatus[RequestStatus["initialized"] = 0] = "initialized";
    RequestStatus[RequestStatus["loading"] = 1] = "loading";
    RequestStatus[RequestStatus["finished"] = 2] = "finished";
    RequestStatus[RequestStatus["cancelled"] = 3] = "cancelled";
    RequestStatus[RequestStatus["failed"] = 4] = "failed";
})(RequestStatus || (RequestStatus = {}));
class FetchRequest {
    constructor(url, requestOptions) {
        this.response = null;
        this.url = url;
        this.abortController = new AbortController();
        this.requestOptions = { ...requestOptions, signal: this.abortController.signal };
        this.status = RequestStatus.initialized;
    }
    async getJson() {
        const response = await this.getResponse();
        if (response === null) {
            return null;
        }
        try {
            return await response.json();
        }
        catch (error) {
            console.error(`Error while parsing json response! (${this.url})`, error, response);
            return null;
        }
    }
    async getText() {
        const response = await this.getResponse();
        return response && (await response.text());
    }
    async getResponse() {
        if (this.status !== RequestStatus.initialized) {
            return this.response;
        }
        this.status = RequestStatus.loading;
        try {
            this.response = await fetch(this.url, this.requestOptions);
            this.status = RequestStatus.finished;
            if (!this.response.ok) {
                console.error(`Response was not successful! (${this.url})`, this.response);
            }
        }
        catch (error) {
            console.error(`Error while fetching data! (${this.url})`, error);
            this.status = RequestStatus.failed;
        }
        return this.response;
    }
    cancel() {
        if (this.status !== RequestStatus.loading) {
            return;
        }
        this.abortController.abort();
        this.status = RequestStatus.cancelled;
    }
}

class RequestService {
    constructor(requestOptions) {
        this.uniqueRequests = new Map();
        this.requestOptions = requestOptions;
    }
    createRequest(path, urlParams) {
        const url = this.buildUrl(path, urlParams);
        return new FetchRequest(url.toString(), this.requestOptions);
    }
    createUniqueRequest(path, urlParams) {
        const url = this.buildUrl(path, urlParams);
        const uniqueRequest = this.uniqueRequests.get(url);
        if (uniqueRequest) {
            uniqueRequest.cancel();
        }
        const request = new FetchRequest(url, this.requestOptions);
        this.uniqueRequests.set(url, request);
        return request;
    }
    buildUrl(path, params) {
        const url = new URL(path, window.location.origin);
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                url.searchParams.append(key, value.toString());
            }
        }
        return url.toString();
    }
}

class ExampleService {
    constructor(requestService) {
        this.sourcePath = 'public/js';
        this.manifestPath = 'public/examples.json';
        this.exampleData = null;
        this.currentExample = null;
        this.requestService = requestService;
        this.loadExampleData();
    }
    get nestedExamples() {
        const data = this.hasExamples
            ? Object.entries(this.exampleData)
            : [];
        return new Map(data.map(([directory, fileNames]) => [
            this.getCleanName(directory),
            fileNames.map(fileName => ({
                name: this.getCleanName(fileName),
                path: `${directory}/${fileName}.js`,
            }))
        ]));
    }
    get examplesList() {
        return Array.from(this.nestedExamples.values()).reduce((result, examples) => ([
            ...result,
            ...examples,
        ]), []);
    }
    get hasExamples() {
        return this.exampleData !== null;
    }
    getExampleByPath(path) {
        return this.examplesList.find(example => example.path === path) || null;
    }
    setCurrentExample(example) {
        this.currentExample = example;
    }
    async loadExampleSource(filePath) {
        const request = this.requestService.createUniqueRequest(`${this.sourcePath}/${filePath}`, {
            'no-cache': Date.now(),
        });
        const response = await request.getText();
        if (response === null) {
            throw new Error(`Could not fetch file ${filePath} on path ${this.sourcePath}!`);
        }
        return response;
    }
    async loadExampleData() {
        const request = this.requestService.createUniqueRequest(this.manifestPath, {
            'no-cache': Date.now(),
        });
        const exampleData = await request.getJson();
        if (exampleData === null) {
            throw new Error(`Could not fetch manifest.json on path ${this.manifestPath}!`);
        }
        runInAction(() => {
            this.exampleData = exampleData;
        });
    }
    getCleanName(text) {
        return text.split('-')
            .map((part) => [...part].some(char => char !== char.toUpperCase())
            ? part[0].toUpperCase() + part.substr(1)
            : part)
            .join(' ');
    }
}
__decorate([
    observable
], ExampleService.prototype, "exampleData", void 0);
__decorate([
    observable
], ExampleService.prototype, "currentExample", void 0);
__decorate([
    computed
], ExampleService.prototype, "nestedExamples", null);
__decorate([
    computed
], ExampleService.prototype, "examplesList", null);
__decorate([
    computed
], ExampleService.prototype, "hasExamples", null);
__decorate([
    action
], ExampleService.prototype, "setCurrentExample", null);
__decorate([
    action
], ExampleService.prototype, "loadExampleData", null);

class DependencyContainer {
    constructor(dependencyFactories) {
        this.dependencies = new Map();
        this.dependencyStack = new Set();
        this.dependencyFactories = dependencyFactories;
    }
    async loadDependencies(config) {
        const keys = Object.keys(this.dependencyFactories);
        for (const name of keys) {
            await this.loadDependency(name, config);
        }
        return this.dependencies;
    }
    get(name) {
        if (!this.dependencies.has(name)) {
            throw new Error(`Could not found loaded dependency ${name}!`);
        }
        return this.dependencies.get(name);
    }
    async loadDependency(name, config) {
        if (this.dependencies.has(name)) {
            return this.dependencies.get(name);
        }
        if (this.dependencyStack.has(name)) {
            const stack = [...this.dependencyStack, name].join(' > ');
            throw new Error(`Circular dependencies detected! Stack: ${stack}`);
        }
        this.dependencyStack.add(name);
        const dependency = await this.dependencyFactories[name](this, config);
        this.dependencyStack.delete(name);
        this.dependencies.set(name, dependency);
        return dependency;
    }
}

class LocationService {
    constructor() {
        this.currentHash = window.location.hash.slice(1);
        window.addEventListener('hashchange', this.handleHashChange);
    }
    setHash(hash) {
        if (hash && hash !== this.currentHash) {
            window.location.hash = hash;
        }
    }
    handleHashChange() {
        this.currentHash = window.location.hash.slice(1);
    }
}
__decorate([
    observable
], LocationService.prototype, "currentHash", void 0);
__decorate([
    action.bound
], LocationService.prototype, "handleHashChange", null);

const globalDependencies = new DependencyContainer({
    requestService: (container, config) => new RequestService(config.requestOptions),
    exampleService: (container) => new ExampleService(container.get('requestService')),
    locationService: () => new LocationService(),
});

let App = class App extends MobxLitElement {
    constructor() {
        super(...arguments);
        this.exampleService = globalDependencies.get('exampleService');
        this.locationService = globalDependencies.get('locationService');
        //
        // private setTitle(title: string): void {
        //     document.title = `${title} - ExoJS Examples`;
        // }
        //
        // private setCurrentHash(path: string): void {
        //     window.location.hash = path;
        // }
        //
        // private updateActiveEditor(source: string): void {
        //
        //     if (this.activeEditor) {
        //         const wrapper = this.activeEditor.getWrapperElement();
        //
        //         wrapper.parentNode?.removeChild(wrapper);
        //
        //         this.activeEditor = null;
        //     }
        //
        //     if (this.codeElement === null) {
        //         console.log('Could not find editor code element!');
        //
        //         return;
        //     }
        //
        //     this.codeElement.innerText = source;
        //
        //     this.activeEditor = CodeMirror.fromTextArea(this.codeElement, {
        //         mode: 'javascript',
        //         theme: 'monokai',
        //         lineNumbers: true,
        //         styleActiveLine: true,
        //         matchBrackets: true,
        //         viewportMargin: Infinity,
        //         lineWrapping: true,
        //         indentUnit: 4,
        //     });
        // }
        //
        // private async createIframeElement(source: string): Promise<HTMLIFrameElement> {
        //
        //     return new Promise<HTMLIFrameElement>(((resolve, reject) => {
        //
        //         const iframe = document.createElement('iframe');
        //
        //         iframe.classList.add('preview-frame');
        //
        //         iframe.onload = (): void => {
        //             try {
        //                 this.addIframeScript(iframe, source);
        //             } catch (e) {
        //                 return reject();
        //             }
        //
        //             resolve(iframe);
        //         };
        //
        //         iframe.onerror = (): void => reject();
        //
        //         iframe.src = 'preview.html';
        //     }));
        // }
        //
        // private addIframeScript(iframe: HTMLIFrameElement, source: string): void {
        //
        //     const iframeBody = iframe.contentWindow?.document.body;
        //
        //     if (!iframeBody) {
        //         throw new Error('Could not access iframe body element!');
        //     }
        //
        //     const script = document.createElement('script');
        //
        //     script.type = 'text/javascript';
        //     script.innerHTML = dedent`
        //         window.onload = function () {
        //             ${source}
        //         }
        //     `;
        //
        //     iframeBody.appendChild(script);
        // }
        //
        // private getActiveExample(): IExample | null {
        //
        //     const activePath = window.location.hash.slice(1);
        //
        //     for (const category of this.config.examples) {
        //         for (const example of category.examples) {
        //             if (!activePath || activePath === example.path) {
        //                 return example;
        //             }
        //         }
        //     }
        //
        //     return null;
        // }
        //
        // private async initExample({ path, title }: IExample): Promise<void> {
        //
        //     this.setTitle(title);
        //     this.setCurrentHash(path);
        //
        //     const source = await this.loadExampleText(path);
        //
        //     if (source === null) {
        //         console.log(`Error loading example text with path ${path}`);
        //
        //         return;
        //     }
        //
        //     const iframe = await this.createIframeElement(source);
        //
        //     this.updateActiveEditor(source);
        // }
        //
        // private async loadExampleText(path: string): Promise<string | null> {
        //
        //     try {
        //         const response = await fetch(`public/js/${path}?no-cache=${Date.now()}`, {
        //             cache: 'no-cache',
        //             method: 'GET',
        //             mode: 'cors',
        //         });
        //
        //         if (!response || !response.ok) {
        //             return null;
        //         }
        //
        //         return response.text();
        //     } catch (e) {
        //         return null;
        //     }
        // }
    }
    connectedCallback() {
        super.connectedCallback();
        reaction(() => [
            this.locationService.currentHash,
            this.exampleService.hasExamples,
        ], ([currentHash, hasExamples]) => {
            var _a;
            if (!hasExamples) {
                return;
            }
            if (!currentHash) {
                this.locationService.setHash((_a = this.exampleService.examplesList[0]) === null || _a === void 0 ? void 0 : _a.path);
                return;
            }
            const example = this.exampleService.getExampleByPath(currentHash);
            this.exampleService.setCurrentExample(example);
        });
    }
    render() {
        return html `
            <div class="${modules_5209ed1c.app}">
                <aside class=${modules_5209ed1c.navigation}>
                    <div class=${modules_5209ed1c.viewport}>
                        <header>
                            <h1 class=${modules_5209ed1c.title}>ExoJs Examples</h1>
                        </header>
                        <my-navigation />
                    </div>
                </aside>
                <main class="${modules_5209ed1c.content}">
                    <my-editor></my-editor>
                </main>
            </div>
        `;
    }
};
App.styles = unsafeCSS(css$3);
App = __decorate([
    customElement('my-app')
], App);

const css$4 = ".navigationLink_0ccc2d3d {\n  transition: background-color 120ms cubic-bezier(0, 0, 0.2, 1);\n  padding: 0 16px;\n  height: 48px;\n  font-size: 16px;\n  line-height: 48px;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  font-weight: 400;\n  color: white;\n  text-decoration: none;\n  position: relative;\n  cursor: pointer;\n  display: block;\n  box-sizing: border-box; }\n  .navigationLink_0ccc2d3d:hover {\n    background-color: rgba(255, 255, 255, 0.12); }\n  .navigationLink_0ccc2d3d:active {\n    background-color: rgba(255, 255, 255, 0.18); }\n";
const modules_a55a6909 = {"navigationLink":"navigationLink_0ccc2d3d"};

let NavigationLink = class NavigationLink extends LitElement {
    render() {
        return html `
            <a href=${this.href} class=${modules_a55a6909.navigationLink}>
                <slot></slot>
            </a>
        `;
    }
};
NavigationLink.styles = unsafeCSS(css$4);
__decorate([
    property({ type: String })
], NavigationLink.prototype, "href", void 0);
NavigationLink = __decorate([
    customElement('my-navigation-link')
], NavigationLink);

const css$5 = ".navigationTitle_84ac336b {\n  transition: background-color 120ms cubic-bezier(0, 0, 0.2, 1);\n  padding: 0 16px;\n  height: 48px;\n  font-size: 14px;\n  line-height: 48px;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  font-weight: 500;\n  color: #FFFF00;\n  text-decoration: none;\n  position: relative;\n  cursor: default;\n  display: block; }\n";
const modules_f2f75330 = {"navigationTitle":"navigationTitle_84ac336b"};

let NavigationTitle = class NavigationTitle extends LitElement {
    render() {
        return html `
            <div class=${modules_f2f75330.navigationTitle}>
                <slot></slot>
            </div>
        `;
    }
};
NavigationTitle.styles = unsafeCSS(css$5);
NavigationTitle = __decorate([
    customElement('my-navigation-title')
], NavigationTitle);

const css$6 = ".navigationSection_4cdca904 {\n  display: flex;\n  flex-direction: column; }\n";
const modules_60c5df30 = {"navigationSection":"navigationSection_4cdca904"};

let NavigationSection = class NavigationSection extends LitElement {
    render() {
        return html `
            <section class=${modules_60c5df30.navigationSection}>
                <my-navigation-title>${this.headline}</my-navigation-title>
                <slot></slot>
            </section>
        `;
    }
};
NavigationSection.styles = unsafeCSS(css$6);
__decorate([
    property({ type: String })
], NavigationSection.prototype, "headline", void 0);
NavigationSection = __decorate([
    customElement('my-navigation-section')
], NavigationSection);

const css$7 = ".navigation_d61dfd22 {\n  padding: 8px 0; }\n";
const modules_2fe7e3bc = {"navigation":"navigation_d61dfd22"};

let Navigation = class Navigation extends MobxLitElement {
    constructor() {
        super(...arguments);
        this.exampleService = globalDependencies.get('exampleService');
    }
    render() {
        const { hasExamples, nestedExamples } = this.exampleService;
        if (!hasExamples) {
            return html `<my-loading-indicator />`;
        }
        return html `
            <nav class=${modules_2fe7e3bc.navigation}>
                ${Array.from(nestedExamples.entries()).map(([category, entries]) => this.renderCategory(category, entries))}
            </nav>
        `;
    }
    renderCategory(headline, entries) {
        return html `
            <my-navigation-section headline=${headline}>
                ${entries.map(({ name, path }) => this.renderLink(name, path))}
            </my-navigation-section>
        `;
    }
    renderLink(name, path) {
        return html `
            <my-navigation-link href="#${path}">${name}</my-navigation-link>
        `;
    }
};
Navigation.styles = unsafeCSS(css$7);
Navigation = __decorate([
    customElement('my-navigation')
], Navigation);

const css$8 = ".preview_2e09ccf0 {\n  width: 100%;\n  height: 100%;\n  border: 0; }\n\ncanvas {\n  display: block; }\n";
const modules_bbec92b6 = {"preview":"preview_2e09ccf0"};

let EditorPreview = class EditorPreview extends LitElement {
    constructor() {
        super(...arguments);
        this.sourceCode = null;
    }
    // @internalProperty() iframeElement: HTMLIFrameElement | null = null;
    // private pendingIframe: Promise<HTMLIFrameElement> | null = null;
    //
    // public connectedCallback(): void {
    //     super.connectedCallback();
    //
    //     this.pendingIframe = this.createIframeElement();
    // }
    render() {
        if (this.sourceCode === null) {
            return html `<span>No Sourcecode to preview...</span>`;
        }
        const iframeSrc = 'preview.html';
        return html `
            <iframe 
                class=${modules_bbec92b6.preview} 
                onload=${this.onLoadIframe}
                onerror=${this.onErrorIframe}
                src=${iframeSrc}
             />
        `;
    }
    // public updated() {
    //     const iframe = this.shadowRoot!.querySelector(styles.preview) as HTMLIFrameElement;
    //
    //     if (!iframe) {
    //         throw new Error('Could not find iframe element!');
    //     }
    //
    //     iframe.onload = (): void => {
    //         try {
    //             this.addIframeScript(iframe, this.sourceCode!);
    //         } catch (error) {
    //             console.error('Could not add source code to iframe!', error);
    //         }
    //     };
    //
    //     iframe.onerror = (error): void => {
    //         console.error('Could not load iframe source!', error);
    //     };
    //
    //     iframe.src = 'preview.html';
    // }
    onLoadIframe(event) {
        console.log('onLoadIframe', event);
        // try {
        //     this.addIframeScript(iframe, this.sourceCode);
        // } catch (e) {
        //     return reject();
        // }
    }
    onErrorIframe(event) {
        console.log('onErrorIframe', event);
        // try {
        //     this.addIframeScript(iframe, this.sourceCode);
        // } catch (e) {
        //     return reject();
        // }
    }
    async createIframeElement() {
        return new Promise(((resolve, reject) => {
            const iframe = document.createElement('iframe');
            iframe.classList.add(modules_bbec92b6.preview);
            iframe.onload = () => {
                try {
                    this.addIframeScript(iframe, this.sourceCode);
                }
                catch (e) {
                    return reject();
                }
                resolve(iframe);
            };
            iframe.onerror = () => reject();
            iframe.src = 'preview.html';
        }));
    }
    addIframeScript(iframe, source) {
        var _a;
        const iframeBody = (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document.body;
        if (!iframeBody) {
            throw new Error('Could not access iframe body element!');
        }
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerHTML = `
            window.onload = function () {
                ${source}
            }
        `;
        iframeBody.appendChild(script);
    }
};
EditorPreview.styles = unsafeCSS(css$8);
__decorate([
    property({ type: String })
], EditorPreview.prototype, "sourceCode", void 0);
EditorPreview = __decorate([
    customElement('my-editor-preview')
], EditorPreview);

const css$9 = ".codemirrorElement_e2494e1a {\n  background: transparent;\n  resize: none;\n  border: 0; }\n\n.CodeMirror_e2494e1a {\n  background: #232323;\n  color: white;\n  height: auto; }\n  .CodeMirror_e2494e1a .CodeMirrorCursor_e2494e1a {\n    border-left: 2px solid #FFFFFF; }\n  .CodeMirror_e2494e1a .CodeMirrorActivelineBackground_e2494e1a {\n    background: #303030; }\n  .CodeMirror_e2494e1a .CodeMirrorSelected_e2494e1a {\n    background: #3d3d3d; }\n  .CodeMirror_e2494e1a .CodeMirrorGutters_e2494e1a {\n    background: #232323; }\n  .CodeMirror_e2494e1a .CodeMirrorLinenumber_e2494e1a {\n    color: rgba(255, 255, 255, 0.7); }\n  .CodeMirror_e2494e1a .cmComment_e2494e1a {\n    color: rgba(255, 255, 255, 0.3); }\n  .CodeMirror_e2494e1a .cmString_e2494e1a {\n    color: #e6db74; }\n  .CodeMirror_e2494e1a .cmNumber_e2494e1a {\n    color: #66d9ef; }\n  .CodeMirror_e2494e1a .cmAtom_e2494e1a {\n    color: #66d9ef; }\n  .CodeMirror_e2494e1a .cmKeyword_e2494e1a {\n    color: #f92672; }\n  .CodeMirror_e2494e1a .cmVariable_e2494e1a {\n    color: #a6e22e; }\n  .CodeMirror_e2494e1a .cmDef_e2494e1a {\n    font-style: italic;\n    color: #FD971F; }\n  .CodeMirror_e2494e1a .cmVariable2_e2494e1a {\n    color: #f92672; }\n  .CodeMirror_e2494e1a .cmProperty_e2494e1a {\n    color: #66d9ef; }\n  .CodeMirror_e2494e1a .cmOperator_e2494e1a {\n    color: #A6A5A5; }\n";
const modules_e6e9bf22 = {"codemirrorElement":"codemirrorElement_e2494e1a","CodeMirror":"CodeMirror_e2494e1a","CodeMirror-cursor":"CodeMirrorCursor_e2494e1a","CodeMirror-activeline-background":"CodeMirrorActivelineBackground_e2494e1a","CodeMirror-selected":"CodeMirrorSelected_e2494e1a","CodeMirror-gutters":"CodeMirrorGutters_e2494e1a","CodeMirror-linenumber":"CodeMirrorLinenumber_e2494e1a","cm-comment":"cmComment_e2494e1a","cm-string":"cmString_e2494e1a","cm-number":"cmNumber_e2494e1a","cm-atom":"cmAtom_e2494e1a","cm-keyword":"cmKeyword_e2494e1a","cm-variable":"cmVariable_e2494e1a","cm-def":"cmDef_e2494e1a","cm-variable-2":"cmVariable2_e2494e1a","cm-property":"cmProperty_e2494e1a","cm-operator":"cmOperator_e2494e1a"};

// Compressed representation of the Grapheme_Cluster_Break=Extend
// information from
// http://www.unicode.org/Public/13.0.0/ucd/auxiliary/GraphemeBreakProperty.txt.
// Each pair of elements represents a range, as an offet from the
// previous range and a length. Numbers are in base-36, with the empty
// string being a shorthand for 1.
let extend = "lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o".split(",").map(s => s ? parseInt(s, 36) : 1);
// Convert offsets into absolute values
for (let i = 1; i < extend.length; i++)
    extend[i] += extend[i - 1];
function isExtendingChar(code) {
    for (let i = 1; i < extend.length; i += 2)
        if (extend[i] > code)
            return extend[i - 1] <= code;
    return false;
}
function isRegionalIndicator(code) {
    return code >= 0x1F1E6 && code <= 0x1F1FF;
}
const ZWJ = 0x200d;
/// Returns a grapheme cluster end _after_ (not equal to) `pos`, if
/// possible. Moves across surrogate pairs, extending characters,
/// characters joined with zero-width joiners, and flag emoji.
function nextClusterBreak(str, pos) {
    if (pos == str.length)
        return pos;
    // If pos is in the middle of a surrogate pair, move to its start
    if (pos && surrogateLow(str.charCodeAt(pos)) && surrogateHigh(str.charCodeAt(pos - 1)))
        pos--;
    let prev = codePointAt(str, pos);
    pos += codePointSize(prev);
    while (pos < str.length) {
        let next = codePointAt(str, pos);
        if (prev == ZWJ || next == ZWJ || isExtendingChar(next)) {
            pos += codePointSize(next);
            prev = next;
        }
        else if (isRegionalIndicator(next)) {
            let countBefore = 0, i = pos - 2;
            while (i >= 0 && isRegionalIndicator(codePointAt(str, i))) {
                countBefore++;
                i -= 2;
            }
            if (countBefore % 2 == 0)
                break;
            else
                pos += 2;
        }
        else {
            break;
        }
    }
    return pos;
}
/// Returns a grapheme cluster end _before_ `pos`, if possible.
function prevClusterBreak(str, pos) {
    while (pos > 0) {
        let found = nextClusterBreak(str, pos - 2);
        if (found < pos)
            return found;
        pos--;
    }
    return 0;
}
function surrogateLow(ch) { return ch >= 0xDC00 && ch < 0xE000; }
function surrogateHigh(ch) { return ch >= 0xD800 && ch < 0xDC00; }
/// Find the code point at the given position in a string (as in the
/// [`codePointAt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/codePointAt)
/// string method).
function codePointAt(str, pos) {
    let code0 = str.charCodeAt(pos);
    if (!surrogateHigh(code0) || pos + 1 == str.length)
        return code0;
    let code1 = str.charCodeAt(pos + 1);
    if (!surrogateLow(code1))
        return code0;
    return ((code0 - 0xd800) << 10) + (code1 - 0xdc00) + 0x10000;
}
/// The first character that takes up two positions in a JavaScript
/// string. It is often useful to compare with this after calling
/// `codePointAt`, to figure out whether your character takes up 1 or
/// 2 index positions.
function codePointSize(code) { return code < 0x10000 ? 1 : 2; }

/// Count the column position at the given offset into the string,
/// taking extending characters and tab size into account.
function countColumn(string, n, tabSize) {
    for (let i = 0; i < string.length;) {
        if (string.charCodeAt(i) == 9) {
            n += tabSize - (n % tabSize);
            i++;
        }
        else {
            n++;
            i = nextClusterBreak(string, i);
        }
    }
    return n;
}
/// Find the offset that corresponds to the given column position in a
/// string, taking extending characters and tab size into account.
function findColumn(string, n, col, tabSize) {
    for (let i = 0; i < string.length;) {
        if (n >= col)
            return { offset: i, leftOver: 0 };
        n += string.charCodeAt(i) == 9 ? tabSize - (n % tabSize) : 1;
        i = nextClusterBreak(string, i);
    }
    return { offset: string.length, leftOver: col - n };
}

/// The document tree type.
class Text {
    /// @internal
    constructor() { }
    /// Get the line description around the given position.
    lineAt(pos) {
        if (pos < 0 || pos > this.length)
            throw new RangeError(`Invalid position ${pos} in document of length ${this.length}`);
        for (let i = 0; i < lineCache.length; i += 2) {
            if (lineCache[i] != this)
                continue;
            let line = lineCache[i + 1];
            if (line.start <= pos && line.end >= pos)
                return line;
        }
        return cacheLine(this, this.lineInner(pos, false, 1, 0).finish(this));
    }
    /// Get the description for the given (1-based) line number.
    line(n) {
        if (n < 1 || n > this.lines)
            throw new RangeError(`Invalid line number ${n} in ${this.lines}-line document`);
        for (let i = 0; i < lineCache.length; i += 2) {
            if (lineCache[i] != this)
                continue;
            let line = lineCache[i + 1];
            if (line.number == n)
                return line;
        }
        return cacheLine(this, this.lineInner(n, true, 1, 0).finish(this));
    }
    /// Replace a range of the text with the given lines. `text` should
    /// have a length of at least one.
    replace(from, to, text) {
        let parts = [];
        this.decompose(0, from, parts);
        parts.push(text);
        this.decompose(to, this.length, parts);
        return TextNode.from(parts, this.length - (to - from) + text.length);
    }
    /// Append another document to this one.
    append(text) {
        return this.length == 0 ? text : text.length == 0 ? this : TextNode.from([this, text], this.length + text.length);
    }
    /// Retrieve the lines between the given points.
    slice(from, to = this.length) {
        let parts = [];
        this.decompose(from, to, parts);
        return TextNode.from(parts, to - from);
    }
    /// Test whether this text is equal to another instance.
    eq(other) { return this == other || eqContent(this, other); }
    /// Iterate over the text. When `dir` is `-1`, iteration happens
    /// from end to start. This will return lines and the breaks between
    /// them as separate strings, and for long lines, might split lines
    /// themselves into multiple chunks as well.
    iter(dir = 1) { return new RawTextCursor(this, dir); }
    /// Iterate over a range of the text. When `from` > `to`, the
    /// iterator will run in reverse.
    iterRange(from, to = this.length) { return new PartialTextCursor(this, from, to); }
    /// Iterate over lines in the text, starting at position (_not_ line
    /// number) `from`. An iterator returned by this combines all text
    /// on a line into a single string (which may be expensive for very
    /// long lines), and skips line breaks (its
    /// [`lineBreak`](#text.TextIterator.lineBreak) property is always
    /// false).
    iterLines(from = 0) { return new LineCursor(this, from); }
    /// @internal
    toString() { return this.sliceString(0); }
    /// Create a `Text` instance for the given array of lines.
    static of(text) {
        if (text.length == 0)
            throw new RangeError("A document must have at least one line");
        if (text.length == 1 && !text[0] && Text.empty)
            return Text.empty;
        let length = textLength(text);
        return length < 1024 /* MaxLeaf */ ? new TextLeaf(text, length) : TextNode.from(TextLeaf.split(text, []), length);
    }
}
if (typeof Symbol != "undefined")
    Text.prototype[Symbol.iterator] = function () { return this.iter(); };
let lineCache = [], lineCachePos = -2, lineCacheSize = 12;
function cacheLine(text, line) {
    lineCachePos = (lineCachePos + 2) % lineCacheSize;
    lineCache[lineCachePos] = text;
    lineCache[lineCachePos + 1] = line;
    return line;
}
// Leaves store an array of strings. There are always line breaks
// between these strings (though not between adjacent Text nodes).
// These are limited in length, so that bigger documents are
// constructed as a tree structure. Long lines will be broken into a
// number of single-line leaves.
class TextLeaf extends Text {
    constructor(text, length = textLength(text)) {
        super();
        this.text = text;
        this.length = length;
    }
    get lines() { return this.text.length; }
    get children() { return null; }
    lineInner(target, isLine, line, offset) {
        for (let i = 0;; i++) {
            let string = this.text[i], end = offset + string.length;
            if ((isLine ? line : end) >= target)
                return new Line(offset, end, line, string);
            offset = end + 1;
            line++;
        }
    }
    decompose(from, to, target) {
        target.push(new TextLeaf(sliceText(this.text, from, to), Math.min(to, this.length) - Math.max(0, from)));
    }
    lastLineLength() { return this.text[this.text.length - 1].length; }
    firstLineLength() { return this.text[0].length; }
    replace(from, to, text) {
        let newLen = this.length + text.length - (to - from);
        if (newLen >= 1024 /* MaxLeaf */ || !(text instanceof TextLeaf))
            return super.replace(from, to, text);
        return new TextLeaf(appendText(this.text, appendText(text.text, sliceText(this.text, 0, from)), to), newLen);
    }
    sliceString(from, to = this.length, lineSep = "\n") {
        return sliceText(this.text, from, to).join(lineSep);
    }
    flatten(target) {
        target[target.length - 1] += this.text[0];
        for (let i = 1; i < this.text.length; i++)
            target.push(this.text[i]);
    }
    static split(text, target) {
        let part = [], length = -1;
        for (let line of text) {
            for (;;) {
                let newLength = length + line.length + 1;
                if (newLength < 512 /* BaseLeaf */) {
                    length = newLength;
                    part.push(line);
                    break;
                }
                let cut = 512 /* BaseLeaf */ - length - 1, after = line.charCodeAt(cut);
                if (after >= 0xdc00 && after < 0xe000)
                    cut++;
                part.push(line.slice(0, cut));
                target.push(new TextLeaf(part, 512 /* BaseLeaf */));
                line = line.slice(cut);
                length = -1;
                part = [];
            }
        }
        if (length != -1)
            target.push(new TextLeaf(part, length));
        return target;
    }
}
// Nodes provide the tree structure of the `Text` type. They store a
// number of other nodes or leaves, taking care to balance itself on
// changes.
class TextNode extends Text {
    constructor(children, length) {
        super();
        this.children = children;
        this.length = length;
        this.lines = 1;
        for (let child of children)
            this.lines += child.lines - 1;
    }
    lineInner(target, isLine, line, offset) {
        for (let i = 0;; i++) {
            let child = this.children[i], end = offset + child.length, endLine = line + child.lines - 1;
            if ((isLine ? endLine : end) >= target) {
                let inner = child.lineInner(target, isLine, line, offset), add;
                if (inner.start == offset && (add = this.lineLengthTo(i))) {
                    inner.start -= add;
                    inner.content = null;
                }
                if (inner.end == end && (add = this.lineLengthFrom(i + 1))) {
                    inner.end += add;
                    inner.content = null;
                }
                return inner;
            }
            offset = end;
            line = endLine;
        }
    }
    decompose(from, to, target) {
        for (let i = 0, pos = 0; pos < to && i < this.children.length; i++) {
            let child = this.children[i], end = pos + child.length;
            if (from < end && to > pos) {
                if (pos >= from && end <= to)
                    target.push(child);
                else
                    child.decompose(from - pos, to - pos, target);
            }
            pos = end;
        }
    }
    lineLengthTo(to) {
        let length = 0;
        for (let i = to - 1; i >= 0; i--) {
            let child = this.children[i];
            if (child.lines > 1)
                return length + child.lastLineLength();
            length += child.length;
        }
        return length;
    }
    lastLineLength() { return this.lineLengthTo(this.children.length); }
    lineLengthFrom(from) {
        let length = 0;
        for (let i = from; i < this.children.length; i++) {
            let child = this.children[i];
            if (child.lines > 1)
                return length + child.firstLineLength();
            length += child.length;
        }
        return length;
    }
    firstLineLength() { return this.lineLengthFrom(0); }
    replace(from, to, text) {
        // Looks like a small change, try to optimize
        if (text.length < 512 /* BaseLeaf */ && to - from < 512 /* BaseLeaf */) {
            let lengthDiff = text.length - (to - from);
            for (let i = 0, pos = 0; i < this.children.length; i++) {
                let child = this.children[i], end = pos + child.length;
                // Fast path: if the change only affects one child and the
                // child's size remains in the acceptable range, only update
                // that child
                if (from >= pos && to <= end &&
                    child.length + lengthDiff < (this.length + lengthDiff) >> (3 /* BranchShift */ - 1) &&
                    child.length + lengthDiff > 0) {
                    let copy = this.children.slice();
                    copy[i] = child.replace(from - pos, to - pos, text);
                    return new TextNode(copy, this.length + lengthDiff);
                }
                pos = end;
            }
        }
        return super.replace(from, to, text);
    }
    sliceString(from, to = this.length, lineSep = "\n") {
        let result = "";
        for (let i = 0, pos = 0; pos < to && i < this.children.length; i++) {
            let child = this.children[i], end = pos + child.length;
            if (from < end && to > pos)
                result += child.sliceString(from - pos, to - pos, lineSep);
            pos = end;
        }
        return result;
    }
    flatten(target) {
        for (let child of this.children)
            child.flatten(target);
    }
    static from(children, length) {
        if (!children.every(ch => ch instanceof Text))
            throw new Error("NOP");
        if (length < 1024 /* MaxLeaf */) {
            let text = [""];
            for (let child of children)
                child.flatten(text);
            return new TextLeaf(text, length);
        }
        let chunkLength = Math.max(512 /* BaseLeaf */, length >> 3 /* BranchShift */), maxLength = chunkLength << 1, minLength = chunkLength >> 1;
        let chunked = [], currentLength = 0, currentChunk = [];
        function add(child) {
            let childLength = child.length, last;
            if (!childLength)
                return;
            if (childLength > maxLength && child instanceof TextNode) {
                for (let node of child.children)
                    add(node);
            }
            else if (childLength > minLength && (currentLength > minLength || currentLength == 0)) {
                flush();
                chunked.push(child);
            }
            else if (child instanceof TextLeaf && currentLength > 0 &&
                (last = currentChunk[currentChunk.length - 1]) instanceof TextLeaf &&
                child.length + last.length <= 512 /* BaseLeaf */) {
                currentLength += childLength;
                currentChunk[currentChunk.length - 1] = new TextLeaf(appendText(child.text, last.text.slice()), child.length + last.length);
            }
            else {
                if (currentLength + childLength > chunkLength)
                    flush();
                currentLength += childLength;
                currentChunk.push(child);
            }
        }
        function flush() {
            if (currentLength == 0)
                return;
            chunked.push(currentChunk.length == 1 ? currentChunk[0] : TextNode.from(currentChunk, currentLength));
            currentLength = 0;
            currentChunk.length = 0;
        }
        for (let child of children)
            add(child);
        flush();
        return chunked.length == 1 ? chunked[0] : new TextNode(chunked, length);
    }
}
Text.empty = Text.of([""]);
function textLength(text) {
    let length = -1;
    for (let line of text)
        length += line.length + 1;
    return length;
}
function appendText(text, target, from = 0, to = 1e9) {
    for (let pos = 0, i = 0, first = true; i < text.length && pos <= to; i++) {
        let line = text[i], end = pos + line.length;
        if (end >= from) {
            if (end > to)
                line = line.slice(0, to - pos);
            if (pos < from)
                line = line.slice(from - pos);
            if (first) {
                target[target.length - 1] += line;
                first = false;
            }
            else
                target.push(line);
        }
        pos = end + 1;
    }
    return target;
}
function sliceText(text, from, to) {
    return appendText(text, [""], from, to);
}
function eqContent(a, b) {
    if (a.length != b.length || a.lines != b.lines)
        return false;
    let iterA = new RawTextCursor(a), iterB = new RawTextCursor(b);
    for (let offA = 0, offB = 0;;) {
        if (iterA.lineBreak != iterB.lineBreak || iterA.done != iterB.done) {
            return false;
        }
        else if (iterA.done) {
            return true;
        }
        else if (iterA.lineBreak) {
            iterA.next();
            iterB.next();
            offA = offB = 0;
        }
        else {
            let strA = iterA.value.slice(offA), strB = iterB.value.slice(offB);
            if (strA.length == strB.length) {
                if (strA != strB)
                    return false;
                iterA.next();
                iterB.next();
                offA = offB = 0;
            }
            else if (strA.length > strB.length) {
                if (strA.slice(0, strB.length) != strB)
                    return false;
                offA += strB.length;
                iterB.next();
                offB = 0;
            }
            else {
                if (strB.slice(0, strA.length) != strA)
                    return false;
                offB += strA.length;
                iterA.next();
                offA = 0;
            }
        }
    }
}
class RawTextCursor {
    constructor(text, dir = 1) {
        this.dir = dir;
        this.done = false;
        this.lineBreak = false;
        this.value = "";
        this.nodes = [text];
        this.offsets = [dir > 0 ? 0 : text instanceof TextLeaf ? text.text.length : text.children.length];
    }
    next(skip = 0) {
        for (;;) {
            let last = this.nodes.length - 1;
            if (last < 0) {
                this.done = true;
                this.value = "";
                this.lineBreak = false;
                return this;
            }
            let top = this.nodes[last];
            let offset = this.offsets[last];
            if (top instanceof TextLeaf) {
                // Internal offset with lineBreak == false means we have to
                // count the line break at this position
                if (offset != (this.dir > 0 ? 0 : top.text.length) && !this.lineBreak) {
                    this.lineBreak = true;
                    if (skip == 0) {
                        this.value = "\n";
                        return this;
                    }
                    skip--;
                    continue;
                }
                // Otherwise, move to the next string
                let next = top.text[offset - (this.dir < 0 ? 1 : 0)];
                this.offsets[last] = (offset += this.dir);
                if (offset == (this.dir > 0 ? top.text.length : 0)) {
                    this.nodes.pop();
                    this.offsets.pop();
                }
                this.lineBreak = false;
                if (next.length > Math.max(0, skip)) {
                    this.value = skip == 0 ? next : this.dir > 0 ? next.slice(skip) : next.slice(0, next.length - skip);
                    return this;
                }
                skip -= next.length;
            }
            else if (offset == (this.dir > 0 ? top.children.length : 0)) {
                this.nodes.pop();
                this.offsets.pop();
            }
            else {
                let next = top.children[this.dir > 0 ? offset : offset - 1], len = next.length;
                this.offsets[last] = offset + this.dir;
                if (skip > len) {
                    skip -= len;
                }
                else {
                    this.nodes.push(next);
                    this.offsets.push(this.dir > 0 ? 0 : next instanceof TextLeaf ? next.text.length : next.children.length);
                }
            }
        }
    }
}
class PartialTextCursor {
    constructor(text, start, end) {
        this.value = "";
        this.cursor = new RawTextCursor(text, start > end ? -1 : 1);
        if (start > end) {
            this.skip = text.length - start;
            this.limit = start - end;
        }
        else {
            this.skip = start;
            this.limit = end - start;
        }
    }
    next() {
        if (this.limit <= 0) {
            this.limit = -1;
        }
        else {
            let { value, lineBreak, done } = this.cursor.next(this.skip);
            this.skip = 0;
            this.value = value;
            let len = lineBreak ? 1 : value.length;
            if (len > this.limit)
                this.value = this.cursor.dir > 0 ? value.slice(0, this.limit) : value.slice(len - this.limit);
            if (done || this.value.length == 0)
                this.limit = -1;
            else
                this.limit -= this.value.length;
        }
        return this;
    }
    get lineBreak() { return this.cursor.lineBreak; }
    get done() { return this.limit < 0; }
}
class LineCursor {
    constructor(text, from = 0) {
        this.value = "";
        this.done = false;
        this.cursor = text.iter();
        this.skip = from;
    }
    next() {
        if (this.cursor.done) {
            this.done = true;
            this.value = "";
            return this;
        }
        for (this.value = "";;) {
            let { value, lineBreak, done } = this.cursor.next(this.skip);
            this.skip = 0;
            if (done || lineBreak)
                return this;
            this.value += value;
        }
    }
    get lineBreak() { return false; }
}
// FIXME rename start/end to from/to for consistency with other types?
/// This type describes a line in the document. It is created
/// on-demand when lines are [queried](#text.Text.lineAt).
class Line {
    /// @internal
    constructor(
    /// The position of the start of the line.
    start, 
    /// The position at the end of the line (_before_ the line break,
    /// if this isn't the last line).
    end, 
    /// This line's line number (1-based).
    number, 
    /// @internal
    content) {
        this.start = start;
        this.end = end;
        this.number = number;
        this.content = content;
    }
    /// The length of the line (not including any line break after it).
    get length() { return this.end - this.start; }
    /// Retrieve a part of the content of this line. This is a method,
    /// rather than, say, a string property, to avoid concatenating long
    /// lines whenever they are accessed. Try to write your code, if it
    /// is going to be doing a lot of line-reading, to read only the
    /// parts it needs.
    slice(from = 0, to = this.length) {
        if (typeof this.content == "string")
            return to == from + 1 ? this.content.charAt(from) : this.content.slice(from, to);
        if (from == to)
            return "";
        let result = this.content.slice(from, to);
        if (from == 0 && to == this.length)
            this.content = result;
        return result;
    }
    /// @internal
    finish(text) {
        if (this.content == null)
            this.content = new LineContent(text, this.start);
        return this;
    }
    /// Find the next (or previous if `forward` is false) grapheme
    /// cluster break from the given start position (as an offset inside
    /// the line, not the document). Will return a position greater than
    /// (or less than if `forward` is false) `start` unless there is no
    /// such index in the string.
    findClusterBreak(start, forward) {
        if (start < 0 || start > this.length)
            throw new RangeError("Invalid position given to Line.findClusterBreak");
        let contextStart, context;
        if (this.content == "string") {
            contextStart = this.start;
            context = this.content;
        }
        else {
            contextStart = Math.max(0, start - 256);
            context = this.slice(contextStart, Math.min(this.length, contextStart + 512));
        }
        return (forward ? nextClusterBreak : prevClusterBreak)(context, start - contextStart) + contextStart;
    }
}
class LineContent {
    constructor(doc, start) {
        this.doc = doc;
        this.start = start;
        this.cursor = null;
        this.strings = null;
    }
    // FIXME quadratic complexity (somewhat) when iterating long lines in small pieces
    slice(from, to) {
        if (!this.cursor) {
            this.cursor = this.doc.iter();
            this.strings = [this.cursor.next(this.start).value];
        }
        for (let result = "", pos = 0, i = 0;; i++) {
            if (i == this.strings.length)
                this.strings.push(this.cursor.next().value);
            let string = this.strings[i], end = pos + string.length;
            if (end <= from)
                continue;
            result += string.slice(Math.max(0, from - pos), Math.min(string.length, to - pos));
            if (end >= to)
                return result;
            pos += string.length;
        }
    }
}

/// The default maximum length of a `TreeBuffer` node.
const DefaultBufferLength = 1024;
class Iteration {
    constructor(enter, leave) {
        this.enter = enter;
        this.leave = leave;
        this.result = undefined;
    }
    get done() { return this.result !== undefined; }
    doEnter(type, start, end) {
        let value = this.enter(type, start, end);
        if (value === undefined)
            return true;
        if (value !== false)
            this.result = value;
        return false;
    }
}
let nextPropID = 0;
/// Each [node type](#tree.NodeType) can have metadata associated with
/// it in props. Instances of this class represent prop names.
class NodeProp {
    /// Create a new node prop type. You can optionally pass a
    /// `deserialize` function.
    constructor({ deserialize } = {}) {
        this.id = nextPropID++;
        this.deserialize = deserialize || (() => {
            throw new Error("This node type doesn't define a deserialize function");
        });
    }
    /// Create a string-valued node prop whose deserialize function is
    /// the identity function.
    static string() { return new NodeProp({ deserialize: str => str }); }
    /// Create a number-valued node prop whose deserialize function is
    /// just `Number`.
    static number() { return new NodeProp({ deserialize: Number }); }
    /// Creates a boolean-valued node prop whose deserialize function
    /// returns true for any input.
    static flag() { return new NodeProp({ deserialize: () => true }); }
    /// Store a value for this prop in the given object. This can be
    /// useful when building up a prop object to pass to the
    /// [`NodeType`](#tree.NodeType) constructor. Returns its first
    /// argument.
    set(propObj, value) {
        propObj[this.id] = value;
        return propObj;
    }
    /// This is meant to be used with
    /// [`NodeGroup.extend`](#tree.NodeGroup.extend) or
    /// [`Parser.withProps`](#lezer.Parser.withProps) to compute prop
    /// values for each node type in the group. Takes a [match
    /// object](#tree.NodeType.match) or function that returns undefined
    /// if the node type doesn't get this prop, and the prop's value if
    /// it does.
    add(match) {
        return new NodePropSource(this, typeof match == "function" ? match : NodeType.match(match));
    }
}
/// The special node type that the parser uses to represent parse
/// errors has this flag set. (You shouldn't use it for custom nodes
/// that represent erroneous content.)
NodeProp.error = NodeProp.flag();
/// Nodes that were produced by skipped expressions (such as
/// comments) have this prop set to true.
NodeProp.skipped = NodeProp.flag();
/// Prop that is used to describe matching delimiters. For opening
/// delimiters, this holds an array of node names (written as a
/// space-separated string when declaring this prop in a grammar)
/// for the node types of closing delimiters that match it.
NodeProp.closedBy = new NodeProp({ deserialize: str => str.split(" ") });
/// The inverse of [`openedBy`](#tree.NodeProp^closedBy). This is
/// attached to closing delimiters, holding an array of node names
/// of types of matching opening delimiters.
NodeProp.openedBy = new NodeProp({ deserialize: str => str.split(" ") });
/// Indicates that this node indicates a top level document.
NodeProp.top = NodeProp.flag();
/// Type returned by [`NodeProp.add`](#tree.NodeProp.add). Describes
/// the way a prop should be added to each node type in a node group.
class NodePropSource {
    /// @internal
    constructor(
    /// @internal
    prop, 
    /// @internal
    f) {
        this.prop = prop;
        this.f = f;
    }
}
/// Each node in a syntax tree has a node type associated with it.
class NodeType {
    /// @internal
    constructor(
    /// The name of the node type. Not necessarily unique, but if the
    /// grammar was written properly, different node types with the
    /// same name within a node group should play the same semantic
    /// role.
    name, 
    /// @internal
    props, 
    /// The id of this node in its group. Corresponds to the term ids
    /// used in the parser.
    id) {
        this.name = name;
        this.props = props;
        this.id = id;
    }
    /// Retrieves a node prop for this type. Will return `undefined` if
    /// the prop isn't present on this node.
    prop(prop) { return this.props[prop.id]; }
    /// Create a function from node types to arbitrary values by
    /// specifying an object whose property names are node names. Often
    /// useful with [`NodeProp.add`](#tree.NodeProp.add). You can put
    /// multiple node names, separated by spaces, in a single property
    /// name to map multiple node names to a single value.
    static match(map) {
        let direct = Object.create(null);
        for (let prop in map)
            for (let name of prop.split(" "))
                direct[name] = map[prop];
        return (node) => direct[node.name];
    }
}
/// An empty dummy node type to use when no actual type is available.
NodeType.none = new NodeType("", Object.create(null), 0);
/// A node group holds a collection of node types. It is used to
/// compactly represent trees by storing their type ids, rather than a
/// full pointer to the type object, in a number array. Each parser
/// [has](#lezer.Parser.group) a node group, and [tree
/// buffers](#tree.TreeBuffer) can only store collections of nodes
/// from the same group. A group can have a maximum of 2**16 (65536)
/// node types in it, so that the ids fit into 16-bit typed array
/// slots.
class NodeGroup {
    /// Create a group with the given types. The `id` property of each
    /// type should correspond to its position within the array.
    constructor(
    /// The node types in this group, by id.
    types) {
        this.types = types;
        for (let i = 0; i < types.length; i++)
            if (types[i].id != i)
                throw new RangeError("Node type ids should correspond to array positions when creating a node group");
    }
    /// Create a copy of this group with some node properties added. The
    /// arguments to this method should be created with
    /// [`NodeProp.add`](#tree.NodeProp.add).
    extend(...props) {
        let newTypes = [];
        for (let type of this.types) {
            let newProps = null;
            for (let source of props) {
                let value = source.f(type);
                if (value !== undefined) {
                    if (!newProps) {
                        newProps = Object.create(null);
                        for (let prop in type.props)
                            newProps[prop] = type.props[prop];
                    }
                    newProps[source.prop.id] = value;
                }
            }
            newTypes.push(newProps ? new NodeType(type.name, newProps, type.id) : type);
        }
        return new NodeGroup(newTypes);
    }
}
/// A subtree is a representation of part of the syntax tree. It may
/// either be the tree root, or a tagged node.
class Subtree {
    // Shorthand for `.type.name`.
    get name() { return this.type.name; }
    /// The depth (number of parent nodes) of this subtree
    get depth() {
        let d = 0;
        for (let p = this.parent; p; p = p.parent)
            d++;
        return d;
    }
    /// The root of the tree that this subtree is part of
    get root() {
        let cx = this;
        while (cx.parent)
            cx = cx.parent;
        return cx;
    }
    /// Find the node at a given position. By default, this will return
    /// the lowest-depth subtree that covers the position from both
    /// sides, meaning that nodes starting or ending at the position
    /// aren't entered. You can pass a `side` of `-1` to enter nodes
    /// that end at the position, or `1` to enter nodes that start
    /// there.
    resolve(pos, side = 0) {
        let result = this.resolveAt(pos);
        // FIXME this is slightly inefficient in that it scans the result
        // of resolveAt twice (but further complicating child-finding
        // logic seems unattractive as well)
        if (side != 0)
            for (;;) {
                let child = (side < 0 ? result.childBefore(pos) : result.childAfter(pos));
                if (!child || (side < 0 ? child.end : child.start) != pos)
                    break;
                result = child;
            }
        return result;
    }
    /// Get the first child of this subtree.
    get firstChild() { return this.childAfter(this.start - 1); }
    /// Find the last child of this subtree.
    get lastChild() { return this.childBefore(this.end + 1); }
}
/// A piece of syntax tree. There are two ways to approach these
/// trees: the way they are actually stored in memory, and the
/// convenient way.
///
/// Syntax trees are stored as a tree of `Tree` and `TreeBuffer`
/// objects. By packing detail information into `TreeBuffer` leaf
/// nodes, the representation is made a lot more memory-efficient.
///
/// However, when you want to actually work with tree nodes, this
/// representation is very awkward, so most client code will want to
/// use the `Subtree` interface instead, which provides a view on some
/// part of this data structure, and can be used (through `resolve`,
/// for example) to zoom in on any single node.
class Tree extends Subtree {
    /// @internal
    constructor(
    /// @internal
    type, 
    /// The tree's child nodes. Children small enough to fit in a
    /// `TreeBuffer` will be represented as such, other children can be
    /// further `Tree` instances with their own internal structure.
    children, 
    /// The positions (offsets relative to the start of this tree) of
    /// the children.
    positions, 
    /// The total length of this tree @internal
    length) {
        super();
        this.type = type;
        this.children = children;
        this.positions = positions;
        this.length = length;
    }
    /// @internal
    get start() { return 0; }
    /// @internal
    get end() { return this.length; }
    /// @internal
    toString() {
        let children = this.children.map(c => c.toString()).join();
        return !this.name ? children :
            (/\W/.test(this.name) && !this.type.prop(NodeProp.error) ? JSON.stringify(this.name) : this.name) +
                (children.length ? "(" + children + ")" : "");
    }
    partial(start, end, offset, children, positions) {
        for (let i = 0; i < this.children.length; i++) {
            let from = this.positions[i];
            if (from > end)
                break;
            let child = this.children[i], to = from + child.length;
            if (to < start)
                continue;
            if (start <= from && end >= to) {
                children.push(child);
                positions.push(from + offset);
            }
            else if (child instanceof Tree) {
                child.partial(start - from, end - from, offset + from, children, positions);
            }
        }
    }
    /// Apply a set of edits to a tree, removing all nodes that were
    /// touched by the edits, and moving remaining nodes so that their
    /// positions are updated for insertions/deletions before them. This
    /// is likely to destroy a lot of the structure of the tree, and
    /// mostly useful for extracting the nodes that can be reused in a
    /// subsequent incremental re-parse.
    applyChanges(changes) {
        if (changes.length == 0)
            return this;
        let children = [], positions = [];
        function cutAt(tree, pos, side) {
            let found = -1;
            tree.iterate({
                from: pos,
                to: side < 0 ? 0 : tree.length,
                enter() { return found < 0 ? undefined : false; },
                leave(type, start, end) {
                    if (found < 0 && (side < 0 ? end <= pos : start >= pos) && !type.prop(NodeProp.error))
                        found = side < 0 ? Math.min(pos, end - 1) : Math.max(pos, start + 1);
                }
            });
            return found > -1 ? found : side < 0 ? 0 : tree.length;
        }
        let off = 0;
        for (let i = 0, pos = 0;; i++) {
            let next = i == changes.length ? null : changes[i];
            let nextPos = next ? cutAt(this, next.fromA, -1) : this.length;
            if (nextPos > pos)
                this.partial(pos, nextPos, off, children, positions);
            if (!next)
                break;
            pos = cutAt(this, next.toA, 1);
            off += (next.toB - next.fromB) - (next.toA - next.fromA);
        }
        return new Tree(NodeType.none, children, positions, this.length + off);
    }
    /// Take the part of the tree up to the given position.
    cut(at) {
        if (at >= this.length)
            return this;
        let children = [], positions = [];
        for (let i = 0; i < this.children.length; i++) {
            let from = this.positions[i];
            if (from >= at)
                break;
            let child = this.children[i], to = from + child.length;
            children.push(to <= at ? child : child.cut(at - from));
            positions.push(from);
        }
        return new Tree(this.type, children, positions, at);
    }
    /// @internal
    iterate({ from = this.start, to = this.end, enter, leave }) {
        let iter = new Iteration(enter, leave);
        this.iterInner(from, to, 0, iter);
        return iter.result;
    }
    /// @internal
    iterInner(from, to, offset, iter) {
        if (this.type.name && !iter.doEnter(this.type, offset, offset + this.length))
            return;
        if (from <= to) {
            for (let i = 0; i < this.children.length && !iter.done; i++) {
                let child = this.children[i], start = this.positions[i] + offset, end = start + child.length;
                if (start > to)
                    break;
                if (end < from)
                    continue;
                child.iterInner(from, to, start, iter);
            }
        }
        else {
            for (let i = this.children.length - 1; i >= 0 && !iter.done; i--) {
                let child = this.children[i], start = this.positions[i] + offset, end = start + child.length;
                if (end < to)
                    break;
                if (start > from)
                    continue;
                child.iterInner(from, to, start, iter);
            }
        }
        if (iter.leave && this.type.name)
            iter.leave(this.type, offset, offset + this.length);
        return;
    }
    /// @internal
    resolveAt(pos) {
        if (cacheRoot == this) {
            for (let tree = cached;;) {
                let next = tree.parent;
                if (!next)
                    break;
                if (tree.start < pos && tree.end > pos)
                    return tree.resolve(pos);
                tree = next;
            }
        }
        cacheRoot = this;
        return cached = this.resolveInner(pos, 0, this);
    }
    /// @internal
    childBefore(pos) {
        return this.findChild(pos, -1, 0, this);
    }
    /// @internal
    childAfter(pos) {
        return this.findChild(pos, 1, 0, this);
    }
    /// @internal
    findChild(pos, side, start, parent) {
        for (let i = 0; i < this.children.length; i++) {
            let childStart = this.positions[i] + start, select = -1;
            if (childStart >= pos) {
                if (side < 0 && i > 0)
                    select = i - 1;
                else if (side > 0)
                    select = i;
                else
                    break;
            }
            if (select < 0 && (childStart + this.children[i].length > pos || side < 0 && i == this.children.length - 1))
                select = i;
            if (select >= 0) {
                let child = this.children[select], childStart = this.positions[select] + start;
                if (child.length == 0 && childStart == pos)
                    continue;
                if (child instanceof Tree) {
                    if (child.type.name)
                        return new NodeSubtree(child, childStart, parent);
                    return child.findChild(pos, side, childStart, parent);
                }
                else {
                    let found = child.findIndex(pos, side, childStart, 0, child.buffer.length);
                    if (found > -1)
                        return new BufferSubtree(child, childStart, found, parent);
                }
            }
        }
        return null;
    }
    /// @internal
    resolveInner(pos, start, parent) {
        let found = this.findChild(pos, 0, start, parent);
        return found ? found.resolveAt(pos) : parent;
    }
    /// Append another tree to this tree. `other` must have empty space
    /// big enough to fit this tree at its start.
    append(other) {
        if (other.children.length && other.positions[0] < this.length)
            throw new Error("Can't append overlapping trees");
        return new Tree(this.type, this.children.concat(other.children), this.positions.concat(other.positions), other.length);
    }
    /// Balance the direct children of this tree.
    balance(maxBufferLength = DefaultBufferLength) {
        return this.children.length <= BalanceBranchFactor ? this
            : balanceRange(this.type, NodeType.none, this.children, this.positions, 0, this.children.length, 0, maxBufferLength, this.length);
    }
    /// Build a tree from a postfix-ordered buffer of node information,
    /// or a cursor over such a buffer. 
    static build(data) { return buildTree(data); }
}
/// The empty tree
Tree.empty = new Tree(NodeType.none, [], [], 0);
Tree.prototype.parent = null;
// Top-level `resolveAt` calls store their last result here, so that
// if the next call is near the last, parent trees can be cheaply
// reused.
let cacheRoot = Tree.empty;
let cached = Tree.empty;
/// Tree buffers contain (type, start, end, endIndex) quads for each
/// node. In such a buffer, nodes are stored in prefix order (parents
/// before children, with the endIndex of the parent indicating which
/// children belong to it)
class TreeBuffer {
    /// Create a tree buffer @internal
    constructor(
    /// @internal
    buffer, 
    // The total length of the group of nodes in the buffer.
    length, 
    /// @internal
    group, 
    /// An optional type tag, used to tag a buffer as being part of a
    /// repetition @internal
    type = NodeType.none) {
        this.buffer = buffer;
        this.length = length;
        this.group = group;
        this.type = type;
    }
    /// @internal
    toString() {
        let parts = [];
        for (let index = 0; index < this.buffer.length;)
            index = this.childToString(index, parts);
        return parts.join(",");
    }
    /// @internal
    childToString(index, parts) {
        let id = this.buffer[index], endIndex = this.buffer[index + 3];
        let type = this.group.types[id], result = type.name;
        if (/\W/.test(result) && !type.prop(NodeProp.error))
            result = JSON.stringify(result);
        index += 4;
        if (endIndex > index) {
            let children = [];
            while (index < endIndex)
                index = this.childToString(index, children);
            result += "(" + children.join(",") + ")";
        }
        parts.push(result);
        return index;
    }
    /// @internal
    cut(at) {
        let cutPoint = 0;
        while (cutPoint < this.buffer.length && this.buffer[cutPoint + 1] < at)
            cutPoint += 4;
        let newBuffer = new Uint16Array(cutPoint);
        for (let i = 0; i < cutPoint; i += 4) {
            newBuffer[i] = this.buffer[i];
            newBuffer[i + 1] = this.buffer[i + 1];
            newBuffer[i + 2] = Math.min(at, this.buffer[i + 2]);
            newBuffer[i + 3] = Math.min(this.buffer[i + 3], cutPoint);
        }
        return new TreeBuffer(newBuffer, Math.min(at, this.length), this.group);
    }
    iterate({ from = 0, to = this.length, enter, leave }) {
        let iter = new Iteration(enter, leave);
        this.iterInner(from, to, 0, iter);
        return iter.result;
    }
    /// @internal
    iterInner(from, to, offset, iter) {
        if (from <= to) {
            for (let index = 0; index < this.buffer.length;)
                index = this.iterChild(from, to, offset, index, iter);
        }
        else {
            this.iterRev(from, to, offset, 0, this.buffer.length, iter);
        }
    }
    /// @internal
    iterChild(from, to, offset, index, iter) {
        let type = this.group.types[this.buffer[index++]], start = this.buffer[index++] + offset, end = this.buffer[index++] + offset, endIndex = this.buffer[index++];
        if (start > to)
            return this.buffer.length;
        if (end >= from && iter.doEnter(type, start, end)) {
            while (index < endIndex && !iter.done)
                index = this.iterChild(from, to, offset, index, iter);
            if (iter.leave)
                iter.leave(type, start, end);
        }
        return endIndex;
    }
    parentNodesByEnd(startIndex, endIndex) {
        // Build up an array of node indices reflecting the order in which
        // non-empty nodes end, to avoid having to scan for parent nodes
        // at every position during reverse iteration.
        let order = [];
        let scan = (index) => {
            let end = this.buffer[index + 3];
            if (end == index + 4)
                return end;
            for (let i = index + 4; i < end;)
                i = scan(i);
            order.push(index);
            return end;
        };
        for (let index = startIndex; index < endIndex;)
            index = scan(index);
        return order;
    }
    /// @internal
    iterRev(from, to, offset, startIndex, endIndex, iter) {
        let endOrder = this.parentNodesByEnd(startIndex, endIndex);
        // Index range for the next non-empty node
        let nextStart = -1, nextEnd = -1;
        let takeNext = () => {
            if (endOrder.length > 0) {
                nextStart = endOrder.pop();
                nextEnd = this.buffer[nextStart + 3];
            }
            else {
                nextEnd = -1;
            }
        };
        takeNext();
        run: for (let index = endIndex; index > startIndex && !iter.done;) {
            while (nextEnd == index) {
                let base = nextStart;
                let id = this.buffer[base], start = this.buffer[base + 1] + offset, end = this.buffer[base + 2] + offset;
                takeNext();
                if (start <= from && end >= to) {
                    if (!iter.doEnter(this.group.types[id], start, end)) {
                        // Skip the entire node
                        index = base;
                        while (nextEnd > base)
                            takeNext();
                        continue run;
                    }
                }
            }
            let endIndex = this.buffer[--index], end = this.buffer[--index] + offset, start = this.buffer[--index] + offset, id = this.buffer[--index];
            if (start > from || end < to)
                continue;
            if ((endIndex != index + 4 || iter.doEnter(this.group.types[id], start, end)) && iter.leave)
                iter.leave(this.group.types[id], start, end);
        }
    }
    /// @internal
    findIndex(pos, side, start, from, to) {
        let lastI = -1;
        for (let i = from, buf = this.buffer; i < to;) {
            let start1 = buf[i + 1] + start, end1 = buf[i + 2] + start;
            let ignore = start1 == end1 && start1 == pos;
            if (start1 >= pos) {
                if (side > 0 && !ignore)
                    return i;
                break;
            }
            if (end1 > pos)
                return i;
            if (!ignore)
                lastI = i;
            i = buf[i + 3];
        }
        return side < 0 ? lastI : -1;
    }
}
class NodeSubtree extends Subtree {
    constructor(node, start, parent) {
        super();
        this.node = node;
        this.start = start;
        this.parent = parent;
    }
    get type() { return this.node.type; }
    get end() { return this.start + this.node.length; }
    resolveAt(pos) {
        if (pos <= this.start || pos >= this.end)
            return this.parent.resolveAt(pos);
        return this.node.resolveInner(pos, this.start, this);
    }
    childBefore(pos) {
        return this.node.findChild(pos, -1, this.start, this);
    }
    childAfter(pos) {
        return this.node.findChild(pos, 1, this.start, this);
    }
    toString() { return this.node.toString(); }
    iterate({ from = this.start, to = this.end, enter, leave }) {
        let iter = new Iteration(enter, leave);
        this.node.iterInner(from, to, this.start, iter);
        return iter.result;
    }
}
class BufferSubtree extends Subtree {
    constructor(buffer, bufferStart, index, parent) {
        super();
        this.buffer = buffer;
        this.bufferStart = bufferStart;
        this.index = index;
        this.parent = parent;
    }
    get type() { return this.buffer.group.types[this.buffer.buffer[this.index]]; }
    get start() { return this.buffer.buffer[this.index + 1] + this.bufferStart; }
    get end() { return this.buffer.buffer[this.index + 2] + this.bufferStart; }
    get endIndex() { return this.buffer.buffer[this.index + 3]; }
    childBefore(pos) {
        let index = this.buffer.findIndex(pos, -1, this.bufferStart, this.index + 4, this.endIndex);
        return index < 0 ? null : new BufferSubtree(this.buffer, this.bufferStart, index, this);
    }
    childAfter(pos) {
        let index = this.buffer.findIndex(pos, 1, this.bufferStart, this.index + 4, this.endIndex);
        return index < 0 ? null : new BufferSubtree(this.buffer, this.bufferStart, index, this);
    }
    iterate({ from = this.start, to = this.end, enter, leave }) {
        let iter = new Iteration(enter, leave);
        if (from <= to)
            this.buffer.iterChild(from, to, this.bufferStart, this.index, iter);
        else
            this.buffer.iterRev(from, to, this.bufferStart, this.index, this.endIndex, iter);
        return iter.result;
    }
    resolveAt(pos) {
        if (pos <= this.start || pos >= this.end)
            return this.parent.resolveAt(pos);
        let found = this.buffer.findIndex(pos, 0, this.bufferStart, this.index + 4, this.endIndex);
        return found < 0 ? this : new BufferSubtree(this.buffer, this.bufferStart, found, this).resolveAt(pos);
    }
    toString() {
        let result = [];
        this.buffer.childToString(this.index, result);
        return result.join("");
    }
}
class FlatBufferCursor {
    constructor(buffer, index) {
        this.buffer = buffer;
        this.index = index;
    }
    get id() { return this.buffer[this.index - 4]; }
    get start() { return this.buffer[this.index - 3]; }
    get end() { return this.buffer[this.index - 2]; }
    get size() { return this.buffer[this.index - 1]; }
    get pos() { return this.index; }
    next() { this.index -= 4; }
    fork() { return new FlatBufferCursor(this.buffer, this.index); }
}
const BalanceBranchFactor = 8;
function buildTree(data) {
    let { buffer, group, topID = 0, maxBufferLength = DefaultBufferLength, reused = [], minRepeatType = group.types.length } = data;
    let cursor = Array.isArray(buffer) ? new FlatBufferCursor(buffer, buffer.length) : buffer;
    let types = group.types;
    function takeNode(parentStart, minPos, children, positions, tagBuffer) {
        let { id, start, end, size } = cursor, buffer;
        let startPos = start - parentStart;
        if (size < 0) { // Reused node
            children.push(reused[id]);
            positions.push(startPos);
            cursor.next();
            return;
        }
        let type = types[id], node;
        if (end - start <= maxBufferLength && (buffer = findBufferSize(cursor.pos - minPos))) {
            // Small enough for a buffer, and no reused nodes inside
            let data = new Uint16Array(buffer.size - buffer.skip);
            let endPos = cursor.pos - buffer.size, index = data.length;
            while (cursor.pos > endPos)
                index = copyToBuffer(buffer.start, data, index);
            node = new TreeBuffer(data, end - buffer.start, group, tagBuffer);
            startPos = buffer.start - parentStart;
        }
        else { // Make it a node
            let endPos = cursor.pos - size;
            cursor.next();
            let localChildren = [], localPositions = [];
            // Check if this is a repeat wrapper. Store the id of the inner
            // repeat node in the variable if it is
            let repeating = id >= group.types.length ? id - (group.types.length - minRepeatType) : -1;
            if (repeating > -1) {
                type = types[repeating];
                while (cursor.pos > endPos) {
                    let isRepeat = cursor.id == repeating; // This starts with an inner repeated node
                    takeNode(start, endPos, localChildren, localPositions, isRepeat ? type : NodeType.none);
                }
            }
            else {
                while (cursor.pos > endPos)
                    takeNode(start, endPos, localChildren, localPositions, NodeType.none);
            }
            localChildren.reverse();
            localPositions.reverse();
            if (repeating > -1 && localChildren.length > BalanceBranchFactor)
                node = balanceRange(type, type, localChildren, localPositions, 0, localChildren.length, 0, maxBufferLength, end - start);
            else
                node = new Tree(type, localChildren, localPositions, end - start);
        }
        children.push(node);
        positions.push(startPos);
    }
    function findBufferSize(maxSize) {
        // Scan through the buffer to find previous siblings that fit
        // together in a TreeBuffer, and don't contain any reused nodes
        // (which can't be stored in a buffer)
        // If `type` is > -1, only include siblings with that same type
        // (used to group repeat content into a buffer)
        let fork = cursor.fork();
        let size = 0, start = 0, skip = 0, minStart = fork.end - maxBufferLength;
        scan: for (let minPos = fork.pos - maxSize; fork.pos > minPos;) {
            let nodeSize = fork.size, startPos = fork.pos - nodeSize;
            if (nodeSize < 0 || startPos < minPos || fork.start < minStart)
                break;
            let localSkipped = fork.id >= minRepeatType ? 4 : 0;
            let nodeStart = fork.start;
            fork.next();
            while (fork.pos > startPos) {
                if (fork.size < 0)
                    break scan;
                if (fork.id >= minRepeatType)
                    localSkipped += 4;
                fork.next();
            }
            start = nodeStart;
            size += nodeSize;
            skip += localSkipped;
        }
        return size > 4 ? { size, start, skip } : null;
    }
    function copyToBuffer(bufferStart, buffer, index) {
        let { id, start, end, size } = cursor;
        cursor.next();
        let startIndex = index;
        if (size > 4) {
            let endPos = cursor.pos - (size - 4);
            while (cursor.pos > endPos)
                index = copyToBuffer(bufferStart, buffer, index);
        }
        if (id < minRepeatType) { // Don't copy repeat nodes into buffers
            buffer[--index] = startIndex;
            buffer[--index] = end - bufferStart;
            buffer[--index] = start - bufferStart;
            buffer[--index] = id;
        }
        return index;
    }
    let children = [], positions = [];
    while (cursor.pos > 0)
        takeNode(0, 0, children, positions, NodeType.none);
    let length = children.length ? positions[0] + children[0].length : 0;
    return new Tree(group.types[topID], children.reverse(), positions.reverse(), length);
}
function balanceRange(outerType, innerType, children, positions, from, to, start, maxBufferLength, length) {
    let localChildren = [], localPositions = [];
    if (length <= maxBufferLength) {
        for (let i = from; i < to; i++) {
            localChildren.push(children[i]);
            localPositions.push(positions[i] - start);
        }
    }
    else {
        let maxChild = Math.max(maxBufferLength, Math.ceil(length * 1.5 / BalanceBranchFactor));
        for (let i = from; i < to;) {
            let groupFrom = i, groupStart = positions[i];
            i++;
            for (; i < to; i++) {
                let nextEnd = positions[i] + children[i].length;
                if (nextEnd - groupStart > maxChild)
                    break;
            }
            if (i == groupFrom + 1) {
                let only = children[groupFrom];
                if (only instanceof Tree && only.type == innerType && only.length > maxChild << 1) { // Too big, collapse
                    for (let j = 0; j < only.children.length; j++) {
                        localChildren.push(only.children[j]);
                        localPositions.push(only.positions[j] + groupStart - start);
                    }
                    continue;
                }
                localChildren.push(only);
            }
            else if (i == groupFrom + 1) {
                localChildren.push(children[groupFrom]);
            }
            else {
                let inner = balanceRange(innerType, innerType, children, positions, groupFrom, i, groupStart, maxBufferLength, positions[i - 1] + children[i - 1].length - groupStart);
                if (innerType != NodeType.none && !containsType(inner.children, innerType))
                    inner = new Tree(NodeType.none, inner.children, inner.positions, inner.length);
                localChildren.push(inner);
            }
            localPositions.push(groupStart - start);
        }
    }
    return new Tree(outerType, localChildren, localPositions, length);
}
function containsType(nodes, type) {
    for (let elt of nodes)
        if (elt.type == type)
            return true;
    return false;
}

const DefaultSplit = /\r\n?|\n/;
/// Distinguishes different ways in which positions can be mapped.
var MapMode;
(function (MapMode) {
    /// Map a position to a valid new position, even when its context
    /// was deleted.
    MapMode[MapMode["Simple"] = 0] = "Simple";
    /// Return -1 if deletion happens across the position.
    MapMode[MapMode["TrackDel"] = 1] = "TrackDel";
    /// Return -1 if the character _before_ the position is deleted.
    MapMode[MapMode["TrackBefore"] = 2] = "TrackBefore";
    /// Return -1 if the character _after_ the position is deleted.
    MapMode[MapMode["TrackAfter"] = 3] = "TrackAfter";
})(MapMode || (MapMode = {}));
/// A change description is a variant of [change set](#state.ChangeSet)
/// that doesn't store the inserted text. As such, it can't be
/// applied, but is cheaper to store and manipulate.
class ChangeDesc {
    // Sections are encoded as pairs of integers. The first is the
    // length in the current document, and the second is -1 for
    // unaffected sections, and the length of the replacement content
    // otherwise. So an insertion would be (0, n>0), a deletion (n>0,
    // 0), and a replacement two positive numbers.
    /// @internal
    constructor(sections) {
        this.sections = sections;
    }
    /// The length of the document before the change.
    get length() {
        let result = 0;
        for (let i = 0; i < this.sections.length; i += 2)
            result += this.sections[i];
        return result;
    }
    /// The length of the document after the change.
    get newLength() {
        let result = 0;
        for (let i = 0; i < this.sections.length; i += 2) {
            let ins = this.sections[i + 1];
            result += ins < 0 ? this.sections[i] : ins;
        }
        return result;
    }
    /// False when there are actual changes in this set.
    get empty() { return this.sections.length == 0 || this.sections.length == 2 && this.sections[1] < 0; }
    /// Iterate over the unchanged parts left by these changes.
    iterGaps(f) {
        for (let i = 0, posA = 0, posB = 0; i < this.sections.length;) {
            let len = this.sections[i++], ins = this.sections[i++];
            if (ins < 0) {
                f(posA, posB, len);
                posB += len;
            }
            else {
                posB += ins;
            }
            posA += len;
        }
    }
    /// Iterate over the ranges changed by these changes. (See
    /// [`ChangeSet.iterChanges`](#state.ChangeSet.iterChanges) for a
    /// variant that also provides you with the inserted text.)
    ///
    /// When `individual` is true, adjacent changes (which are kept
    /// separate for [position mapping](#state.ChangeDesc.mapPos)) are
    /// reported separately.
    iterChangedRanges(f, individual = false) {
        iterChanges(this, f, individual);
    }
    /// Get a description of the inverted form of these changes.
    get invertedDesc() {
        let sections = [];
        for (let i = 0; i < this.sections.length;) {
            let len = this.sections[i++], ins = this.sections[i++];
            if (ins < 0)
                sections.push(len, ins);
            else
                sections.push(ins, len);
        }
        return new ChangeDesc(sections);
    }
    /// Compute the combined effect of applying another set of changes
    /// after this one. The length of the document after this set should
    /// match the length before `other`.
    composeDesc(other) { return this.empty ? other : other.empty ? this : composeSets(this, other); }
    /// Map this description, which should start with the same document
    /// as `other`, over another set of changes, so that it can be
    /// applied after it.
    mapDesc(other, before = false) { return other.empty ? this : mapSet(this, other, before); }
    /// Map a given position through these changes.
    ///
    /// `assoc` indicates which side the position should be associated
    /// with. When it is negative or zero, the mapping will try to keep
    /// the position close to the character before it (if any), and will
    /// move it before insertions at that point or replacements across
    /// that point. When it is positive, the position is associated with
    /// the character after it, and will be moved forward for insertions
    /// at or replacements across the position. Defaults to -1.
    ///
    /// `mode` determines whether deletions should be
    /// [reported](#state.MapMode). It defaults to `MapMode.Simple`
    /// (don't report deletions).
    mapPos(pos, assoc = -1, mode = MapMode.Simple) {
        let posA = 0, posB = 0;
        for (let i = 0; i < this.sections.length;) {
            let len = this.sections[i++], ins = this.sections[i++], endA = posA + len;
            if (ins < 0) {
                if (endA > pos)
                    return posB + (pos - posA);
                posB += len;
            }
            else {
                if (mode != MapMode.Simple && endA >= pos &&
                    (mode == MapMode.TrackDel && posA < pos && endA > pos ||
                        mode == MapMode.TrackBefore && posA < pos ||
                        mode == MapMode.TrackAfter && endA > pos))
                    return -1;
                if (endA > pos || endA == pos && assoc < 0 && !len)
                    return pos == posA || assoc < 0 ? posB : posB + ins;
                posB += ins;
            }
            posA = endA;
        }
        if (pos > posA)
            throw new RangeError(`Position ${pos} is out of range for changeset of length ${posA}`);
        return posB;
    }
    /// Map a position in a way that reliably produces the same position
    /// for a sequence of changes, regardless of the order in which they
    /// were [mapped](#state.ChangeSet.map) and applied. This will map a
    /// position to the start (or end) through _all_ adjacent changes
    /// next to it, and often produces more surprising results than
    /// [`mapPos`](#state.ChangeDesc.mapPos). But it can be useful in
    /// cases where it is important that all clients in a collaborative
    /// setting end up doing the precise same mapping.
    mapPosStable(pos, side = -1) {
        let posA = 0, posB = 0, lastB = 0;
        for (let i = 0; i < this.sections.length;) {
            let len = this.sections[i++], ins = this.sections[i++], endA = posA + len;
            if (ins < 0) {
                if (endA > pos)
                    return posB + Math.max(0, pos - posA);
                lastB = posB += len;
            }
            else {
                if (side <= 0 && endA >= pos)
                    return lastB;
                posB += ins;
            }
            posA = endA;
        }
        return posB;
    }
    /// Check whether these changes touch a given range. When one of the
    /// changes entirely covers the range, the string `"cover"` is
    /// returned.
    touchesRange(from, to) {
        for (let i = 0, pos = 0; i < this.sections.length && pos <= to;) {
            let len = this.sections[i++], ins = this.sections[i++], end = pos + len;
            if (ins >= 0 && pos <= to && end >= from)
                return pos < from && end > to ? "cover" : true;
            pos = end;
        }
        return false;
    }
    /// @internal
    toString() {
        let result = "";
        for (let i = 0; i < this.sections.length;) {
            let len = this.sections[i++], ins = this.sections[i++];
            result += (result ? " " : "") + len + (ins >= 0 ? ":" + ins : "");
        }
        return result;
    }
}
/// A change set represents a group of modifications to a document. It
/// stores the document length, and can only be applied to documents
/// with exactly that length.
class ChangeSet extends ChangeDesc {
    /// @internal
    constructor(sections, 
    /// @internal
    inserted) {
        super(sections);
        this.inserted = inserted;
    }
    /// Apply the changes to a document, returning the modified
    /// document.
    apply(doc) {
        if (this.length != doc.length)
            throw new RangeError("Applying change set to a document with the wrong length");
        iterChanges(this, (fromA, toA, fromB, _toB, text) => doc = doc.replace(fromB, fromB + (toA - fromA), text), false);
        return doc;
    }
    /// Map this set, which should start with the same document as
    /// `other`, over another set of changes, so that it can be applied
    /// after it. When `before` is true, map as if the changes in
    /// `other` happened before the ones in `this`.
    mapDesc(other, before = false) { return mapSet(this, other, before, true); }
    /// Given the document as it existed _before_ the changes, return a
    /// change set that represents the inverse of this set, which could
    /// be used to go from the document created by the changes back to
    /// the document as it existed before the changes.
    invert(doc) {
        let sections = this.sections.slice(), inserted = [];
        for (let i = 0, pos = 0; i < sections.length; i += 2) {
            let len = sections[i], ins = sections[i + 1];
            if (ins >= 0) {
                sections[i] = ins;
                sections[i + 1] = len;
                let index = i >> 1;
                while (inserted.length < index)
                    inserted.push(Text.empty);
                inserted.push(len ? doc.slice(pos, pos + len) : Text.empty);
            }
            pos += len;
        }
        return new ChangeSet(sections, inserted);
    }
    /// Combine two subsequent change sets into a single set. `other`
    /// must start in the document produced by `this`. If `this` goes
    /// `docA` → `docB` and `other` represents `docB` → `docC`, the
    /// returned value will represent the change `docA` → `docC`.
    compose(other) { return this.empty ? other : other.empty ? this : composeSets(this, other, true); }
    /// Given another change set starting in the same document, maps this
    /// change set over the other, producing a new change set that can be
    /// applied to the document produced by applying `other`. When
    /// `before` is `true`, order changes as if `this` comes before
    /// `other`, otherwise (the default) treat `other` as coming first.
    ///
    /// Given two changes `A` and `B`, `A.compose(B.map(A))` and
    /// `B.compose(A.map(B, true))` will produce the same document. This
    /// provides a basic form of [operational
    /// transformation](https://en.wikipedia.org/wiki/Operational_transformation),
    /// and can be used for collaborative editing.
    map(other, before = false) { return other.empty ? this : mapSet(this, other, before, true); }
    /// Iterate over the changed ranges in the document, calling `f` for
    /// each.
    iterChanges(f, individual = false) {
        iterChanges(this, f, individual);
    }
    /// Get a [change description](#state.ChangeDesc) for this change
    /// set.
    get desc() { return new ChangeDesc(this.sections); }
    /// @internal
    filter(ranges) {
        let resultSections = [], resultInserted = [], filteredSections = [];
        let iter = new SectionIter(this);
        done: for (let i = 0, pos = 0;;) {
            let next = i == ranges.length ? 1e9 : ranges[i++];
            while (pos < next || pos == next && iter.len == 0) {
                if (iter.done)
                    break done;
                let len = Math.min(iter.len, next - pos);
                addSection(filteredSections, len, -1);
                let ins = iter.ins == -1 ? -1 : iter.off == 0 ? iter.ins : 0;
                addSection(resultSections, len, ins);
                if (ins > 0)
                    addInsert(resultInserted, resultSections, iter.text);
                iter.forward(len);
                pos += len;
            }
            let end = ranges[i++];
            while (pos < end) {
                if (iter.done)
                    break done;
                let len = Math.min(iter.len, end - pos);
                addSection(resultSections, len, -1);
                addSection(filteredSections, len, iter.ins == -1 ? -1 : iter.off == 0 ? iter.ins : 0);
                iter.forward(len);
                pos += len;
            }
        }
        return { changes: new ChangeSet(resultSections, resultInserted),
            filtered: new ChangeDesc(filteredSections) };
    }
    /// Create a change set for the given changes, for a document of the
    /// given length, using `lineSep` as line separator.
    static of(changes, length, lineSep) {
        let sections = [], inserted = [], pos = 0;
        let total = null;
        function flush(force = false) {
            if (!force && !sections.length)
                return;
            if (pos < length)
                addSection(sections, length - pos, -1);
            let set = new ChangeSet(sections, inserted);
            total = total ? total.compose(set.map(total)) : set;
            sections = [];
            inserted = [];
            pos = 0;
        }
        function process(spec) {
            if (Array.isArray(spec)) {
                for (let sub of spec)
                    process(sub);
            }
            else if (spec instanceof ChangeSet) {
                if (spec.length != length)
                    throw new RangeError(`Mismatched change set length (got ${spec.length}, expected ${length})`);
                flush();
                total = total ? total.compose(spec.map(total)) : spec;
            }
            else {
                let { from, to = from, insert } = spec;
                if (from > to || from < 0 || to > length)
                    throw new RangeError(`Invalid change range ${from} to ${to} (in doc of length ${length})`);
                let insText = !insert ? Text.empty : typeof insert == "string" ? Text.of(insert.split(lineSep || DefaultSplit)) : insert;
                let insLen = insText.length;
                if (from == to && insLen == 0)
                    return;
                if (from < pos)
                    flush();
                if (from > pos)
                    addSection(sections, from - pos, -1);
                addSection(sections, to - from, insLen);
                addInsert(inserted, sections, insText);
                pos = to;
            }
        }
        process(changes);
        flush(!total);
        return total;
    }
    /// Create an empty changeset of the given length.
    static empty(length) {
        return new ChangeSet(length ? [length, -1] : [], []);
    }
}
function addSection(sections, len, ins, forceJoin = false) {
    if (len == 0 && ins <= 0)
        return;
    let last = sections.length - 2;
    if (last >= 0 && ins <= 0 && ins == sections[last + 1])
        sections[last] += len;
    else if (len == 0 && sections[last] == 0)
        sections[last + 1] += ins;
    else if (forceJoin) {
        sections[last] += len;
        sections[last + 1] += ins;
    }
    else
        sections.push(len, ins);
}
function addInsert(values, sections, value) {
    if (value.length == 0)
        return;
    let index = (sections.length - 2) >> 1;
    if (index < values.length) {
        values[values.length - 1] = values[values.length - 1].append(value);
    }
    else {
        while (values.length < index)
            values.push(Text.empty);
        values.push(value);
    }
}
function iterChanges(desc, f, individual) {
    let inserted = desc.inserted;
    for (let posA = 0, posB = 0, i = 0; i < desc.sections.length;) {
        let len = desc.sections[i++], ins = desc.sections[i++];
        if (ins < 0) {
            posA += len;
            posB += len;
        }
        else {
            let endA = posA, endB = posB, text = Text.empty;
            for (;;) {
                endA += len;
                endB += ins;
                if (ins && inserted)
                    text = text.append(inserted[(i - 2) >> 1]);
                if (individual || i == desc.sections.length || desc.sections[i + 1] < 0)
                    break;
                len = desc.sections[i++];
                ins = desc.sections[i++];
            }
            f(posA, endA, posB, endB, text);
            posA = endA;
            posB = endB;
        }
    }
}
function mapSet(setA, setB, before, mkSet = false) {
    let sections = [], insert = mkSet ? [] : null;
    let a = new SectionIter(setA), b = new SectionIter(setB);
    for (let posA = 0, posB = 0;;) {
        if (a.ins == -1) {
            posA += a.len;
            a.next();
        }
        else if (b.ins == -1 && posB < posA) {
            let skip = Math.min(b.len, posA - posB);
            b.forward(skip);
            addSection(sections, skip, -1);
            posB += skip;
        }
        else if (b.ins >= 0 && (a.done || posB < posA || posB == posA && (b.len < a.len || b.len == a.len && !before))) {
            addSection(sections, b.ins, -1);
            while (posA > posB && !a.done && posA + a.len < posB + b.len) {
                posA += a.len;
                a.next();
            }
            posB += b.len;
            b.next();
        }
        else if (a.ins >= 0) {
            let len = 0, end = posA + a.len;
            for (;;) {
                if (b.ins >= 0 && posB > posA && posB + b.len < end) {
                    len += b.ins;
                    posB += b.len;
                    b.next();
                }
                else if (b.ins == -1 && posB < end) {
                    let skip = Math.min(b.len, end - posB);
                    len += skip;
                    b.forward(skip);
                    posB += skip;
                }
                else {
                    break;
                }
            }
            addSection(sections, len, a.ins);
            if (insert)
                addInsert(insert, sections, a.text);
            posA = end;
            a.next();
        }
        else if (a.done && b.done) {
            return insert ? new ChangeSet(sections, insert) : new ChangeDesc(sections);
        }
        else {
            throw new Error("Mismatched change set lengths");
        }
    }
}
function composeSets(setA, setB, mkSet = false) {
    let sections = [];
    let insert = mkSet ? [] : null;
    let a = new SectionIter(setA), b = new SectionIter(setB);
    for (let open = false;;) {
        if (a.done && b.done) {
            return insert ? new ChangeSet(sections, insert) : new ChangeDesc(sections);
        }
        else if (a.ins == 0) { // Deletion in A
            addSection(sections, a.len, 0, open);
            a.next();
        }
        else if (b.len == 0 && !b.done) { // Insertion in B
            addSection(sections, 0, b.ins, open);
            if (insert)
                addInsert(insert, sections, b.text);
            b.next();
        }
        else if (a.done || b.done) {
            throw new Error("Mismatched change set lengths");
        }
        else {
            let len = Math.min(a.len2, b.len), sectionLen = sections.length;
            if (a.ins == -1) {
                let insB = b.ins == -1 ? -1 : b.off ? 0 : b.ins;
                addSection(sections, len, insB, open);
                if (insert && insB)
                    addInsert(insert, sections, b.text);
            }
            else if (b.ins == -1) {
                addSection(sections, a.off ? 0 : a.len, len, open);
                if (insert)
                    addInsert(insert, sections, a.textBit(len));
            }
            else {
                addSection(sections, a.off ? 0 : a.len, b.off ? 0 : b.ins, open);
                if (insert && !b.off)
                    addInsert(insert, sections, b.text);
            }
            open = (a.ins > len || b.ins >= 0 && b.len > len) && (open || sections.length > sectionLen);
            a.forward2(len);
            b.forward(len);
        }
    }
}
class SectionIter {
    constructor(set) {
        this.set = set;
        this.i = 0;
        this.next();
    }
    next() {
        let { sections } = this.set;
        if (this.i < sections.length) {
            this.len = sections[this.i++];
            this.ins = sections[this.i++];
        }
        else {
            this.len = 0;
            this.ins = -2;
        }
        this.off = 0;
    }
    get done() { return this.ins == -2; }
    get len2() { return this.ins < 0 ? this.len : this.ins; }
    get text() {
        let { inserted } = this.set, index = (this.i - 2) >> 1;
        return index >= inserted.length ? Text.empty : inserted[index];
    }
    textBit(len) {
        let { inserted } = this.set, index = (this.i - 2) >> 1;
        return index >= inserted.length && !len ? Text.empty
            : inserted[index].slice(this.off, len == null ? undefined : this.off + len);
    }
    forward(len) {
        if (len == this.len)
            this.next();
        else {
            this.len -= len;
            this.off += len;
        }
    }
    forward2(len) {
        if (this.ins == -1)
            this.forward(len);
        else if (len == this.ins)
            this.next();
        else {
            this.ins -= len;
            this.off += len;
        }
    }
}

/// A single selection range. When
/// [`allowMultipleSelections`](#state.EditorState^allowMultipleSelections)
/// is enabled, a [selection](#state.EditorSelection) may hold
/// multiple ranges. By default, selections hold exactly one range.
class SelectionRange {
    // @internal
    constructor(
    /// The lower side of the range.
    from, 
    /// The upper side of the range.
    to, flags) {
        this.from = from;
        this.to = to;
        this.flags = flags;
    }
    /// The anchor of the range—the side that doesn't move when you
    /// extend it.
    get anchor() { return this.flags & 16 /* Inverted */ ? this.to : this.from; }
    /// The head of the range, which is moved when the range is
    /// [extended](#state.SelectionRange.extend).
    get head() { return this.flags & 16 /* Inverted */ ? this.from : this.to; }
    /// True when `anchor` and `head` are at the same position.
    get empty() { return this.from == this.to; }
    /// If this is a cursor that is explicitly associated with the
    /// character on one of its sides, this returns the side. -1 means
    /// the character before its position, 1 the character after, and 0
    /// means no association.
    get assoc() { return this.flags & 4 /* AssocBefore */ ? -1 : this.flags & 8 /* AssocAfter */ ? 1 : 0; }
    /// The bidirectional text level associated with this cursor.
    get bidiLevel() {
        let level = this.flags & 3 /* BidiLevelMask */;
        return level == 3 ? null : level;
    }
    get goalColumn() {
        let value = this.flags >> 5 /* GoalColumnOffset */;
        return value == 33554431 /* NoGoalColumn */ ? undefined : value;
    }
    /// Map this range through a mapping.
    map(mapping) {
        let from = mapping.mapPos(this.from), to = mapping.mapPos(this.to);
        return from == this.from && to == this.to ? this : new SelectionRange(from, to, this.flags);
    }
    /// Extend this range to cover at least `from` to `to`.
    extend(from, to = from) {
        if (from <= this.anchor && to >= this.anchor)
            return EditorSelection.range(from, to);
        let head = Math.abs(from - this.anchor) > Math.abs(to - this.anchor) ? from : to;
        return EditorSelection.range(this.anchor, head);
    }
    /// Compare this range to another range.
    eq(other) {
        return this.anchor == other.anchor && this.head == other.head;
    }
    /// Return a JSON-serializable object representing the range.
    toJSON() { return { anchor: this.anchor, head: this.head }; }
    /// Convert a JSON representation of a range to a `SelectionRange`
    /// instance.
    static fromJSON(json) {
        if (!json || typeof json.anchor != "number" || typeof json.head != "number")
            throw new RangeError("Invalid JSON representation for SelectionRange");
        return EditorSelection.range(json.anchor, json.head);
    }
}
/// An editor selection holds one or more selection ranges.
class EditorSelection {
    /// @internal
    constructor(
    /// The ranges in the selection, sorted by position. Ranges cannot
    /// overlap (but they may touch, if they aren't empty).
    ranges, 
    /// The index of the _primary_ range in the selection (which is
    /// usually the range that was added last).
    primaryIndex = 0) {
        this.ranges = ranges;
        this.primaryIndex = primaryIndex;
    }
    /// Map a selection through a mapping. Mostly used to adjust the
    /// selection position for changes.
    map(mapping) {
        if (mapping.empty)
            return this;
        return EditorSelection.create(this.ranges.map(r => r.map(mapping)), this.primaryIndex);
    }
    /// Compare this selection to another selection.
    eq(other) {
        if (this.ranges.length != other.ranges.length ||
            this.primaryIndex != other.primaryIndex)
            return false;
        for (let i = 0; i < this.ranges.length; i++)
            if (!this.ranges[i].eq(other.ranges[i]))
                return false;
        return true;
    }
    /// Get the primary selection range. Usually, you should make sure
    /// your code applies to _all_ ranges, by using methods like
    /// [`changeByRange`](#state.EditorState.changeByRange).
    get primary() { return this.ranges[this.primaryIndex]; }
    /// Make sure the selection only has one range. Returns a selection
    /// holding only the primary range from this selection.
    asSingle() {
        return this.ranges.length == 1 ? this : new EditorSelection([this.primary]);
    }
    /// Extend this selection with an extra range.
    addRange(range, primary = true) {
        return EditorSelection.create([range].concat(this.ranges), primary ? 0 : this.primaryIndex + 1);
    }
    /// Replace a given range with another range, and then normalize the
    /// selection to merge and sort ranges if necessary.
    replaceRange(range, which = this.primaryIndex) {
        let ranges = this.ranges.slice();
        ranges[which] = range;
        return EditorSelection.create(ranges, this.primaryIndex);
    }
    /// Convert this selection to an object that can be serialized to
    /// JSON.
    toJSON() {
        return { ranges: this.ranges.map(r => r.toJSON()), primaryIndex: this.primaryIndex };
    }
    /// Create a selection from a JSON representation.
    static fromJSON(json) {
        if (!json || !Array.isArray(json.ranges) || typeof json.primaryIndex != "number" || json.primaryIndex >= json.ranges.length)
            throw new RangeError("Invalid JSON representation for EditorSelection");
        return new EditorSelection(json.ranges.map((r) => SelectionRange.fromJSON(r)), json.primaryIndex);
    }
    /// Create a selection holding a single range.
    static single(anchor, head = anchor) {
        return new EditorSelection([EditorSelection.range(anchor, head)], 0);
    }
    /// Sort and merge the given set of ranges, creating a valid
    /// selection.
    static create(ranges, primaryIndex = 0) {
        for (let pos = 0, i = 0; i < ranges.length; i++) {
            let range = ranges[i];
            if (range.empty ? range.from <= pos : range.from < pos)
                return normalized(ranges.slice(), primaryIndex);
            pos = range.to;
        }
        return new EditorSelection(ranges, primaryIndex);
    }
    /// Create a cursor selection range at the given position. You can
    /// probably ignore [association](#state.SelectionRange.assoc) and
    /// [bidi level](#state.SelectionRange.bidiLevel) in most
    /// situations.
    static cursor(pos, assoc = 0, bidiLevel, goalColumn) {
        return new SelectionRange(pos, pos, (assoc == 0 ? 0 : assoc < 0 ? 4 /* AssocBefore */ : 8 /* AssocAfter */) |
            (bidiLevel == null ? 3 : Math.min(2, bidiLevel)) |
            ((goalColumn !== null && goalColumn !== void 0 ? goalColumn : 33554431 /* NoGoalColumn */) << 5 /* GoalColumnOffset */));
    }
    /// Create a selection range.
    static range(anchor, head, goalColumn) {
        let goal = (goalColumn !== null && goalColumn !== void 0 ? goalColumn : 33554431 /* NoGoalColumn */) << 5 /* GoalColumnOffset */;
        return head < anchor ? new SelectionRange(head, anchor, 16 /* Inverted */ | goal) : new SelectionRange(anchor, head, goal);
    }
}
function normalized(ranges, primaryIndex = 0) {
    let primary = ranges[primaryIndex];
    ranges.sort((a, b) => a.from - b.from);
    primaryIndex = ranges.indexOf(primary);
    for (let i = 1; i < ranges.length; i++) {
        let range = ranges[i], prev = ranges[i - 1];
        if (range.empty ? range.from <= prev.to : range.from < prev.to) {
            let from = prev.from, to = Math.max(range.to, prev.to);
            if (i <= primaryIndex)
                primaryIndex--;
            ranges.splice(--i, 2, range.anchor > range.head ? EditorSelection.range(to, from) : EditorSelection.range(from, to));
        }
    }
    return new EditorSelection(ranges, primaryIndex);
}
function checkSelection(selection, docLength) {
    for (let range of selection.ranges)
        if (range.to > docLength)
            throw new RangeError("Selection points outside of document");
}

let nextID = 0;
/// A facet is a value that is assicated with a state and can be
/// influenced by any number of extensions. Extensions can provide
/// input values for the facet, and the facet combines those into an
/// output value.
///
/// Examples of facets are the theme styles associated with an editor
/// (which are all stored) or the tab size (which is reduced to a
/// single value, using the input with the hightest precedence).
class Facet {
    constructor(
    /// @internal
    combine, 
    /// @internal
    compareInput, 
    /// @internal
    compare, isStatic) {
        this.combine = combine;
        this.compareInput = compareInput;
        this.compare = compare;
        this.isStatic = isStatic;
        /// @internal
        this.id = nextID++;
        this.default = combine([]);
    }
    /// Define a new facet.
    static define(config = {}) {
        return new Facet(config.combine || ((a) => a), config.compareInput || ((a, b) => a === b), config.compare || (!config.combine ? sameArray : (a, b) => a === b), !!config.static);
    }
    /// Returns an extension that adds the given value for this facet.
    of(value) {
        return new FacetProvider([], this, 0 /* Static */, value);
    }
    /// Create an extension that computes a value for the facet from a
    /// state. You must take care to declare the parts of the state that
    /// this value depends on, since your function is only called again
    /// for a new state when one of those parts changed.
    ///
    /// In most cases, you'll want to use the
    /// [`provide`](#state.StateField^define^config.provide) option when
    /// defining a field instead.
    compute(deps, get) {
        if (this.isStatic)
            throw new Error("Can't compute a static facet");
        return new FacetProvider(deps, this, 1 /* Single */, get);
    }
    /// Create an extension that computes zero or more values for this
    /// facet from a state.
    computeN(deps, get) {
        if (this.isStatic)
            throw new Error("Can't compute a static facet");
        return new FacetProvider(deps, this, 2 /* Multi */, get);
    }
    /// Helper method for registering a facet source with a state field
    /// via its [`provide`](#state.StateField^define^config.provide) option.
    /// Returns a value that can be passed to that option to make the
    /// field automatically provide a value for this facet.
    from(get, prec) {
        return field => maybePrec(prec, this.compute([field], state => get(state.field(field))));
    }
    /// Helper for [providing](#state.StateField^define^config.provide)
    /// a dynamic number of values for this facet from a state field.
    nFrom(get, prec) {
        return field => maybePrec(prec, this.computeN([field], state => get(state.field(field))));
    }
}
function sameArray(a, b) {
    return a == b || a.length == b.length && a.every((e, i) => e === b[i]);
}
class FacetProvider {
    constructor(dependencies, facet, type, value) {
        this.dependencies = dependencies;
        this.facet = facet;
        this.type = type;
        this.value = value;
        this.id = nextID++;
    }
    dynamicSlot(addresses) {
        let getter = this.value;
        let compare = this.facet.compareInput;
        let idx = addresses[this.id] >> 1, multi = this.type == 2 /* Multi */;
        let depDoc = false, depSel = false, depAddrs = [];
        for (let dep of this.dependencies) {
            if (dep == "doc")
                depDoc = true;
            else if (dep == "selection")
                depSel = true;
            else if ((addresses[dep.id] & 1) == 0)
                depAddrs.push(addresses[dep.id]);
        }
        return (state, tr) => {
            if (!tr || tr.reconfigured) {
                state.values[idx] = getter(state);
                return 1 /* Changed */;
            }
            else {
                let depChanged = (depDoc && tr.docChanged) || (depSel && (tr.docChanged || tr.selection)) ||
                    depAddrs.some(addr => (ensureAddr(state, addr) & 1 /* Changed */) > 0);
                if (!depChanged)
                    return 0;
                let newVal = getter(state), oldVal = tr.startState.values[idx];
                if (multi ? compareArray(newVal, oldVal, compare) : compare(newVal, oldVal))
                    return 0;
                state.values[idx] = newVal;
                return 1 /* Changed */;
            }
        };
    }
}
function compareArray(a, b, compare) {
    if (a.length != b.length)
        return false;
    for (let i = 0; i < a.length; i++)
        if (!compare(a[i], b[i]))
            return false;
    return true;
}
function dynamicFacetSlot(addresses, facet, providers) {
    let providerAddrs = providers.map(p => addresses[p.id]);
    let providerTypes = providers.map(p => p.type);
    let dynamic = providerAddrs.filter(p => !(p & 1));
    let idx = addresses[facet.id] >> 1;
    return (state, tr) => {
        let oldAddr = !tr ? null : tr.reconfigured ? tr.startState.config.address[facet.id] : idx << 1;
        let changed = oldAddr == null;
        for (let dynAddr of dynamic) {
            if (ensureAddr(state, dynAddr) & 1 /* Changed */)
                changed = true;
        }
        if (!changed)
            return 0;
        let values = [];
        for (let i = 0; i < providerAddrs.length; i++) {
            let value = getAddr(state, providerAddrs[i]);
            if (providerTypes[i] == 2 /* Multi */)
                for (let val of value)
                    values.push(val);
            else
                values.push(value);
        }
        let newVal = facet.combine(values);
        if (oldAddr != null && facet.compare(newVal, getAddr(tr.startState, oldAddr)))
            return 0;
        state.values[idx] = newVal;
        return 1 /* Changed */;
    };
}
function maybeIndex(state, id) {
    let found = state.config.address[id];
    return found == null ? null : found >> 1;
}
/// Fields can store additional information in an editor state, and
/// keep it in sync with the rest of the state.
class StateField {
    constructor(
    /// @internal
    id, createF, updateF, compareF, 
    /// @internal
    facets) {
        this.id = id;
        this.createF = createF;
        this.updateF = updateF;
        this.compareF = compareF;
        this.facets = facets;
    }
    /// Define a state field.
    static define(config) {
        let facets = [];
        let field = new StateField(nextID++, config.create, config.update, config.compare || ((a, b) => a === b), facets);
        if (config.provide)
            for (let p of config.provide) {
                if (p instanceof Facet)
                    facets.push(p.compute([field], state => state.field(field)));
                else
                    facets.push(p(field));
            }
        return field;
    }
    /// @internal
    slot(addresses) {
        let idx = addresses[this.id] >> 1;
        return (state, tr) => {
            if (!tr) {
                state.values[idx] = this.createF(state);
                return 1 /* Changed */;
            }
            let oldVal, changed = 0;
            if (tr.reconfigured) {
                let oldIdx = maybeIndex(tr.startState, this.id);
                oldVal = oldIdx == null ? this.createF(tr.startState) : tr.startState.values[oldIdx];
                changed = 1 /* Changed */;
            }
            else {
                oldVal = tr.startState.values[idx];
            }
            let value = this.updateF(oldVal, tr, state);
            if (!changed && !this.compareF(oldVal, value))
                changed = 1 /* Changed */;
            if (changed)
                state.values[idx] = value;
            return changed;
        };
    }
}
/// By default extensions are registered in the order they are
/// provided in a flattening of the nested arrays that were provided.
/// Individual extension values can be assigned a precedence to
/// override this. Extensions that do not have a precedence set get
/// the precedence of the nearest parent with a precedence, or
/// [`Default`](#state.Precedence^Default) if there is no such parent.
/// The final ordering of extensions is determined by first sorting by
/// precedence and then by order within each precedence.
class Precedence {
    constructor(
    /// @internal
    val) {
        this.val = val;
    }
    /// Tag an extension with this precedence.
    set(extension) {
        return new PrecExtension(extension, this.val);
    }
}
/// A precedence below the default precedence, which will cause
/// default-precedence extensions to override it even if they are
/// specified later in the extension ordering.
Precedence.Fallback = new Precedence(3);
/// The regular default precedence.
Precedence.Default = new Precedence(2);
/// A higher-than-default precedence.
Precedence.Extend = new Precedence(1);
/// Precedence above the `Default` and `Extend` precedences.
Precedence.Override = new Precedence(0);
function maybePrec(prec, ext) {
    return prec == null ? ext : prec.set(ext);
}
class PrecExtension {
    constructor(e, prec) {
        this.e = e;
        this.prec = prec;
    }
}
class TaggedExtension {
    constructor(tag, extension) {
        this.tag = tag;
        this.extension = extension;
    }
}
class Configuration {
    constructor(source, replacements, dynamicSlots, address, staticValues) {
        this.source = source;
        this.replacements = replacements;
        this.dynamicSlots = dynamicSlots;
        this.address = address;
        this.staticValues = staticValues;
        this.statusTemplate = [];
        while (this.statusTemplate.length < staticValues.length)
            this.statusTemplate.push(0 /* Uninitialized */);
    }
    staticFacet(facet) {
        let addr = this.address[facet.id];
        return addr == null ? facet.default : this.staticValues[addr >> 1];
    }
    static resolve(extension, replacements = Object.create(null), oldState) {
        let fields = [];
        let facets = Object.create(null);
        for (let ext of flatten(extension, replacements)) {
            if (ext instanceof StateField)
                fields.push(ext);
            else
                (facets[ext.facet.id] || (facets[ext.facet.id] = [])).push(ext);
        }
        let address = Object.create(null);
        let staticValues = [];
        let dynamicSlots = [];
        for (let field of fields) {
            address[field.id] = dynamicSlots.length << 1;
            dynamicSlots.push(a => field.slot(a));
        }
        for (let id in facets) {
            let providers = facets[id], facet = providers[0].facet;
            if (providers.every(p => p.type == 0 /* Static */)) {
                address[facet.id] = (staticValues.length << 1) | 1;
                let value = facet.combine(providers.map(p => p.value));
                let oldAddr = oldState ? oldState.config.address[facet.id] : null;
                if (oldAddr != null) {
                    let oldVal = getAddr(oldState, oldAddr);
                    if (facet.compare(value, oldVal))
                        value = oldVal;
                }
                staticValues.push(value);
            }
            else {
                for (let p of providers) {
                    if (p.type == 0 /* Static */) {
                        address[p.id] = (staticValues.length << 1) | 1;
                        staticValues.push(p.value);
                    }
                    else {
                        address[p.id] = dynamicSlots.length << 1;
                        dynamicSlots.push(a => p.dynamicSlot(a));
                    }
                }
                address[facet.id] = dynamicSlots.length << 1;
                dynamicSlots.push(a => dynamicFacetSlot(a, facet, providers));
            }
        }
        return new Configuration(extension, replacements, dynamicSlots.map(f => f(address)), address, staticValues);
    }
}
function allKeys(obj) {
    return (Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(obj) : []).concat(Object.keys(obj));
}
function flatten(extension, replacements) {
    let result = [[], [], [], []];
    let seen = new Set();
    let tagsSeen = Object.create(null);
    function inner(ext, prec) {
        if (seen.has(ext))
            return;
        seen.add(ext);
        if (Array.isArray(ext)) {
            for (let e of ext)
                inner(e, prec);
        }
        else if (ext instanceof TaggedExtension) {
            if (ext.tag in tagsSeen)
                throw new RangeError(`Duplicate use of tag '${String(ext.tag)}' in extensions`);
            tagsSeen[ext.tag] = true;
            inner(replacements[ext.tag] || ext.extension, prec);
        }
        else if (ext.extension) {
            inner(ext.extension, prec);
        }
        else if (ext instanceof PrecExtension) {
            inner(ext.e, ext.prec);
        }
        else {
            result[prec].push(ext);
            if (ext instanceof StateField)
                inner(ext.facets, prec);
        }
    }
    inner(extension, Precedence.Default.val);
    for (let key of allKeys(replacements))
        if (!(key in tagsSeen)) {
            tagsSeen[key] = true;
            inner(replacements[key], Precedence.Default.val);
        }
    return result.reduce((a, b) => a.concat(b));
}
function ensureAddr(state, addr) {
    if (addr & 1)
        return 2 /* Computed */;
    let idx = addr >> 1;
    let status = state.status[idx];
    if (status == 4 /* Computing */)
        throw new Error("Cyclic dependency between fields and/or facets");
    if (status & 2 /* Computed */)
        return status;
    state.status[idx] = 4 /* Computing */;
    let changed = state.config.dynamicSlots[idx](state, state.applying);
    return state.status[idx] = 2 /* Computed */ | changed;
}
function getAddr(state, addr) {
    return addr & 1 ? state.config.staticValues[addr >> 1] : state.values[addr >> 1];
}

const allowMultipleSelections = Facet.define({
    combine: values => values.some(v => v),
    static: true
});
const changeFilter = Facet.define();
const transactionFilter = Facet.define();
/// A node prop that can be stored on a grammar's top node to
/// associate information with the language. Different extension might
/// use different properties from this object (which they typically
/// export as an interface).
const languageData = new NodeProp();
const addLanguageData = Facet.define();
/// Indentation contexts are used when calling
/// [`EditorState.indentation`](#state.EditorState^indentation). They
/// provide helper utilities useful in indentation logic, and can
/// selectively override the indentation reported for some
/// lines.
class IndentContext {
    /// Create an indent context.
    ///
    /// The optional second argument can be used to override line
    /// indentations provided to the indentation helper function, which
    /// is useful when implementing region indentation, where
    /// indentation for later lines needs to refer to previous lines,
    /// which may have been reindented compared to the original start
    /// state. If given, this function should return -1 for lines (given
    /// by start position) that didn't change, and an updated
    /// indentation otherwise.
    ///
    /// The third argument can be used to make it look, to the indent
    /// logic, like a line break was added at the given position (which
    /// is mostly just useful for implementing
    /// [`insertNewlineAndIndent`](#commands.insertNewlineAndIndent).
    constructor(
    /// The editor state.
    state, 
    /// @internal
    overrideIndentation, 
    /// @internal
    simulateBreak) {
        this.state = state;
        this.overrideIndentation = overrideIndentation;
        this.simulateBreak = simulateBreak;
    }
    /// The indent unit (number of columns per indentation level).
    get unit() { return this.state.indentUnit; }
    /// Get the text directly after `pos`, either the entire line
    /// or the next 100 characters, whichever is shorter.
    textAfterPos(pos) {
        return this.state.sliceDoc(pos, Math.min(pos + 100, this.simulateBreak != null && this.simulateBreak >= pos ? this.simulateBreak : 1e9, this.state.doc.lineAt(pos).end));
    }
    /// find the column position (taking tabs into account) of the given
    /// position in the given string.
    countColumn(line, pos) {
        return countColumn(pos < 0 ? line : line.slice(0, pos), 0, this.state.tabSize);
    }
    /// Find the indentation column of the given document line.
    lineIndent(line) {
        if (this.overrideIndentation) {
            let override = this.overrideIndentation(line.start);
            if (override > -1)
                return override;
        }
        let text = line.slice(0, Math.min(100, line.length));
        return this.countColumn(text, text.search(/\S/));
    }
    /// Find the column for the given position.
    column(pos) {
        let line = this.state.doc.lineAt(pos), text = line.slice(0, pos - line.start);
        let result = this.countColumn(text, pos - line.start);
        let override = this.overrideIndentation ? this.overrideIndentation(line.start) : -1;
        if (override > -1)
            result += override - this.countColumn(text, text.search(/\S/));
        return result;
    }
}

/// Annotations are tagged values that are used to add metadata to
/// transactions in an extensible way. They should be used to model
/// things that effect the entire transaction (such as its [time
/// stamp](#state.Transaction^time) or information about its
/// [origin](#state.Transaction^userEvent)). For effects that happen
/// _alongside_ the other changes made by the transaction, [state
/// effects](#state.StateEffect) are more appropriate.
class Annotation {
    /// @internal
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
    /// Define a new type of annotation.
    static define() { return new AnnotationType(); }
}
/// Marker that identifies a type of [annotation](#state.Annotation).
class AnnotationType {
    of(value) { return new Annotation(this, value); }
}
/// State effects can be used to represent additional effects
/// associated with a [transaction](#state.Transaction.effects). They
/// are often useful to model changes to custom [state
/// fields](#state.StateField), when those changes aren't implicit in
/// document or selection changes.
class StateEffect {
    /// @internal
    constructor(
    /// @internal
    type, 
    /// The value of this effect.
    value) {
        this.type = type;
        this.value = value;
    }
    /// Map this effect through a position mapping. Will return
    /// `undefined` when that ends up deleting the effect.
    map(mapping) {
        let mapped = this.type.map(this.value, mapping);
        return mapped === undefined ? undefined : mapped == this.value ? this : new StateEffect(this.type, mapped);
    }
    /// Tells you whether this effect object is of a given
    /// [type](#state.StateEffectType).
    is(type) { return this.type == type; }
    /// Define a new effect type. The type parameter indicates the type
    /// of values that his effect holds.
    static define(spec = {}) {
        return new StateEffectType(spec.map || (v => v));
    }
    /// Map an array of effects through a change set.
    static mapEffects(effects, mapping) {
        if (!effects.length)
            return effects;
        let result = [];
        for (let effect of effects) {
            let mapped = effect.map(mapping);
            if (mapped)
                result.push(mapped);
        }
        return result;
    }
}
/// Representation of a type of state effect. Defined with
/// [`StateEffect.define`](#state.StateEffect^define).
class StateEffectType {
    /// @internal
    constructor(
    // The `any` types in these function types are there to work
    // around TypeScript issue #37631, where the type guard on
    // `StateEffect.is` mysteriously stops working when these properly
    // have type `Value`.
    /// @internal
    map) {
        this.map = map;
    }
    /// Create a [state effect](#state.StateEffect) instance of this
    /// type.
    of(value) { return new StateEffect(this, value); }
}
/// Changes to the editor state are grouped into transactions.
/// Typically, a user action creates a single transaction, which may
/// contain any number of document changes, may change the selection,
/// or have other effects. Create a transaction by calling
/// [`EditorState.update`](#state.EditorState.update).
class Transaction {
    /// @internal
    constructor(
    /// The state from which the transaction starts.
    startState, 
    /// The document changes made by this transaction.
    changes, 
    /// The selection set by this transaction, or undefined if it
    /// doesn't explicitly set a selection.
    selection, 
    /// The effects added to the transaction.
    effects, annotations, flags) {
        this.startState = startState;
        this.changes = changes;
        this.selection = selection;
        this.effects = effects;
        this.annotations = annotations;
        this.flags = flags;
        if (!this.annotations.some((a) => a.type == Transaction.time))
            this.annotations = this.annotations.concat(Transaction.time.of(Date.now()));
    }
    /// Get the value of the given annotation type, if any.
    annotation(type) {
        for (let ann of this.annotations)
            if (ann.type == type)
                return ann.value;
        return undefined;
    }
    /// Indicates whether the transaction changed the document.
    get docChanged() { return !this.changes.empty; }
    /// Query whether the selection should be scrolled into view after
    /// applying this transaction.
    get scrolledIntoView() { return (this.flags & 2 /* scrollIntoView */) > 0; }
    /// Indicates whether the transaction reconfigures the state.
    get reconfigured() { return (this.flags & 1 /* reconfigured */) > 0; }
}
/// Annotation used to store transaction timestamps.
Transaction.time = Annotation.define();
/// Annotation used to associate a transaction with a user interface
/// event. The view will set this to...
///
///  - `"input"` when the user types text
///  - `"delete"` when the user deletes the selection or text near the selection
///  - `"keyboardselection"` when moving the selection via the keyboard
///  - `"pointerselection"` when moving the selection through the pointing device
///  - `"paste"` when pasting content
///  - `"cut"` when cutting
///  - `"drop"` when content is inserted via drag-and-drop
Transaction.userEvent = Annotation.define();
/// Annotation indicating whether a transaction should be added to
/// the undo history or not.
Transaction.addToHistory = Annotation.define();
class ResolvedTransactionSpec {
    constructor(changes, selection, effects, annotations, scrollIntoView, filter, reconfigure, replaceExtensions) {
        this.changes = changes;
        this.selection = selection;
        this.effects = effects;
        this.annotations = annotations;
        this.scrollIntoView = scrollIntoView;
        this.filter = filter;
        this.reconfigure = reconfigure;
        this.replaceExtensions = replaceExtensions;
    }
    static create(state, specs) {
        let spec;
        if (Array.isArray(specs)) {
            if (specs.length)
                return specs.map(s => ResolvedTransactionSpec.create(state, s)).reduce((a, b) => a.combine(b));
            spec = {};
        }
        else if (specs instanceof ResolvedTransactionSpec) {
            return specs;
        }
        else {
            spec = specs;
        }
        let sel = spec.selection;
        return new ResolvedTransactionSpec(spec.changes ? state.changes(spec.changes) : ChangeSet.empty(state.doc.length), sel && (sel instanceof EditorSelection ? sel : EditorSelection.single(sel.anchor, sel.head)), !spec.effects ? none : Array.isArray(spec.effects) ? spec.effects : [spec.effects], !spec.annotations ? none : Array.isArray(spec.annotations) ? spec.annotations : [spec.annotations], !!spec.scrollIntoView, spec.filter !== false, spec.reconfigure, spec.replaceExtensions);
    }
    combine(b) {
        let a = this;
        let changesA = a.changes.mapDesc(b.changes, true), changesB = b.changes.map(a.changes);
        return new ResolvedTransactionSpec(a.changes.compose(changesB), b.selection ? b.selection.map(changesA) : a.selection ? a.selection.map(changesB) : undefined, StateEffect.mapEffects(a.effects, changesB).concat(StateEffect.mapEffects(b.effects, changesA)), a.annotations.length ? a.annotations.concat(b.annotations) : b.annotations, a.scrollIntoView || b.scrollIntoView, a.filter && b.filter, b.reconfigure || a.reconfigure, b.replaceExtensions || (b.reconfigure ? undefined : a.replaceExtensions));
    }
    filterChanges(state) {
        if (!this.filter)
            return this;
        let result = true;
        for (let filter of state.facet(changeFilter)) {
            let value = filter(this, state);
            if (value === false) {
                result = false;
                break;
            }
            if (Array.isArray(value))
                result = result === true ? value : joinRanges(result, value);
        }
        if (result === true)
            return this;
        let changes, back;
        if (result === false) {
            back = this.changes.invertedDesc;
            changes = ChangeSet.empty(state.doc.length);
        }
        else {
            let filtered = this.changes.filter(result);
            changes = filtered.changes;
            back = filtered.filtered.invertedDesc;
        }
        return new ResolvedTransactionSpec(changes, this.selection && this.selection.map(back), StateEffect.mapEffects(this.effects, back), this.annotations, this.scrollIntoView, this.filter, this.reconfigure, this.replaceExtensions);
    }
    filterTransaction(state) {
        if (!this.filter)
            return this;
        let result = this;
        let filters = state.facet(transactionFilter);
        for (let i = filters.length - 1; i >= 0; i--)
            result = ResolvedTransactionSpec.create(state, filters[i](result, state));
        return result;
    }
}
function joinRanges(a, b) {
    let result = [];
    for (let iA = 0, iB = 0;;) {
        let from, to;
        if (iA < a.length && (iB == b.length || b[iB] >= a[iA])) {
            from = a[iA++];
            to = a[iA++];
        }
        else if (iB < b.length) {
            from = b[iB++];
            to = b[iB++];
        }
        else
            return result;
        if (!result.length || result[result.length - 1] < from)
            result.push(from, to);
        else if (result[result.length - 1] < to)
            result[result.length - 1] = to;
    }
}
const none = [];

/// This is used to [categorize](#state.EditorState.charCategorizer)
/// characters into three categories—word characters, whitespace, and
/// anything else. It is used do things like selecting by word.
var CharCategory;
(function (CharCategory) {
    CharCategory[CharCategory["Word"] = 0] = "Word";
    CharCategory[CharCategory["Space"] = 1] = "Space";
    CharCategory[CharCategory["Other"] = 2] = "Other";
})(CharCategory || (CharCategory = {}));
const nonASCIISingleCaseWordChar = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
let wordChar;
try {
    wordChar = new RegExp("[\\p{Alphabetic}_]", "u");
}
catch (_) { }
function hasWordChar(str) {
    if (wordChar)
        return wordChar.test(str);
    for (let i = 0; i < str.length; i++) {
        let ch = str[i];
        if (/\w/.test(ch) || ch > "\x80" && (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch)))
            return true;
    }
    return false;
}
function makeCategorizer(wordChars) {
    return (char) => {
        if (!/\S/.test(char))
            return CharCategory.Space;
        if (hasWordChar(char))
            return CharCategory.Word;
        for (let i = 0; i < wordChars.length; i++)
            if (char.indexOf(wordChars[i]) > -1)
                return CharCategory.Word;
        return CharCategory.Other;
    };
}

/// The editor state class is a persistent (immutable) data structure.
/// To update a state, you [create](#state.EditorState.update) a
/// [transaction](#state.Transaction), which produces a _new_ state
/// instance, without modifying the original object.
///
/// As such, _never_ mutate properties of a state directly. That'll
/// just break things.
class EditorState {
    /// @internal
    constructor(
    /// @internal
    config, 
    /// The current document.
    doc, 
    /// The current selection.
    selection, tr = null) {
        this.config = config;
        this.doc = doc;
        this.selection = selection;
        /// @internal
        this.applying = null;
        this.status = config.statusTemplate.slice();
        if (tr && !tr.reconfigured) {
            this.values = tr.startState.values.slice();
        }
        else {
            this.values = config.dynamicSlots.map(_ => null);
            // Copy over old values for shared facets/fields if this is a reconfigure
            if (tr)
                for (let id in config.address) {
                    let cur = config.address[id], prev = tr.startState.config.address[id];
                    if (prev != null && (cur & 1) == 0)
                        this.values[cur >> 1] = getAddr(tr.startState, prev);
                }
        }
        this.applying = tr;
        if (tr)
            tr.state = this;
        for (let i = 0; i < this.config.dynamicSlots.length; i++)
            ensureAddr(this, i << 1);
        this.applying = null;
    }
    field(field, require = true) {
        let addr = this.config.address[field.id];
        if (addr == null) {
            if (require)
                throw new RangeError("Field is not present in this state");
            return undefined;
        }
        ensureAddr(this, addr);
        return getAddr(this, addr);
    }
    /// Create a [transaction](#state.Transaction) that updates this
    /// state. Any number of [transaction specs](#state.TransactionSpec)
    /// can be passed. The [changes](#state.TransactionSpec.changes) (if
    /// any) of each spec are assumed to start in the _current_ document
    /// (not the document produced by previous specs), and its
    /// [selection](#state.TransactionSpec.selection) and
    /// [effects](#state.TransactionSpec.effects) are assumed to refer
    /// to the document created by its _own_ changes. The resulting
    /// transaction contains the combined effect of all the different
    /// specs. For things like
    /// [selection](#state.TransactionSpec.selection) or
    /// [reconfiguration](#state.TransactionSpec.reconfigure), later
    /// specs take precedence over earlier ones.
    update(...specs) {
        let spec = ResolvedTransactionSpec.create(this, specs).filterChanges(this).filterTransaction(this);
        if (spec.selection)
            checkSelection(spec.selection, spec.changes.newLength);
        let reconf = spec.reconfigure || spec.replaceExtensions, conf = !reconf ? this.config
            : Configuration.resolve(spec.reconfigure || this.config.source, spec.replaceExtensions, this);
        let flags = (reconf ? 1 /* reconfigured */ : 0) | (spec.scrollIntoView ? 2 /* scrollIntoView */ : 0);
        let tr = new Transaction(this, spec.changes, spec.selection, spec.effects, spec.annotations, flags);
        new EditorState(conf, spec.changes.apply(this.doc), spec.selection || this.selection.map(spec.changes), tr);
        return tr;
    }
    /// Create a [transaction spec](#state.StrictTransactionSpec) that
    /// replaces every selection range with the given content.
    replaceSelection(text) {
        if (typeof text == "string")
            text = this.toText(text);
        return this.changeByRange(range => ({ changes: { from: range.from, to: range.to, insert: text },
            range: EditorSelection.cursor(range.from + text.length) }));
    }
    /// Create a set of changes and a new selection by running the given
    /// function for each range in the active selection. The function
    /// can return an optional set of changes (in the coordinate space
    /// of the start document), plus an updated range (in the coordinate
    /// space of the document produced by the call's own changes). This
    /// method will merge all the changes and ranges into a single
    /// changeset and selection, and return it as a [transaction
    /// spec](#state.StrictTransactionSpec), which can be passed to
    /// [`update`](#state.EditorState.update).
    changeByRange(f) {
        let sel = this.selection;
        let result1 = f(sel.ranges[0]);
        let changes = this.changes(result1.changes), ranges = [result1.range];
        for (let i = 1; i < sel.ranges.length; i++) {
            let result = f(sel.ranges[i]);
            let newChanges = this.changes(result.changes), newMapped = newChanges.map(changes);
            for (let j = 0; j < i; j++)
                ranges[j] = ranges[j].map(newMapped);
            ranges.push(result.range.map(changes.mapDesc(newChanges, true)));
            changes = changes.compose(newMapped);
        }
        return ResolvedTransactionSpec.create(this, {
            changes,
            selection: EditorSelection.create(ranges, sel.primaryIndex)
        });
    }
    /// Create a [change set](#state.ChangeSet) from the given change
    /// description, taking the state's document length and line
    /// separator into account.
    changes(spec = []) {
        if (spec instanceof ChangeSet)
            return spec;
        return ChangeSet.of(spec, this.doc.length, this.facet(EditorState.lineSeparator));
    }
    /// Using the state's [line
    /// separator](#state.EditorState^lineSeparator), create a
    /// [`Text`](#text.Text) instance from the given string.
    toText(string) {
        return Text.of(string.split(this.facet(EditorState.lineSeparator) || DefaultSplit));
    }
    /// Return the given range of the document as a string.
    sliceDoc(from = 0, to = this.doc.length) {
        return this.doc.sliceString(from, to, this.lineBreak);
    }
    /// Get the value of a state [facet](#state.Facet).
    facet(facet) {
        let addr = this.config.address[facet.id];
        if (addr == null)
            return facet.default;
        ensureAddr(this, addr);
        return getAddr(this, addr);
    }
    /// Convert this state to a JSON-serializable object.
    toJSON() {
        // FIXME plugin state serialization
        return {
            doc: this.sliceDoc(),
            selection: this.selection.toJSON()
        };
    }
    /// Deserialize a state from its JSON representation.
    static fromJSON(json, config = {}) {
        if (!json || typeof json.doc != "string")
            throw new RangeError("Invalid JSON representation for EditorState");
        return EditorState.create({
            doc: json.doc,
            selection: EditorSelection.fromJSON(json.selection),
            extensions: config.extensions
        });
    }
    /// Create a new state. You'll usually only need this when
    /// initializing an editor—updated states are created by applying
    /// transactions.
    static create(config = {}) {
        let configuration = Configuration.resolve(config.extensions || []);
        let doc = config.doc instanceof Text ? config.doc
            : Text.of((config.doc || "").split(configuration.staticFacet(EditorState.lineSeparator) || DefaultSplit));
        let selection = !config.selection ? EditorSelection.single(0)
            : config.selection instanceof EditorSelection ? config.selection
                : EditorSelection.single(config.selection.anchor, config.selection.head);
        checkSelection(selection, doc.length);
        if (!configuration.staticFacet(allowMultipleSelections))
            selection = selection.asSingle();
        return new EditorState(configuration, doc, selection);
    }
    /// The size (in columns) of a tab in the document, determined by
    /// the [`tabSize`](#state.EditorState^tabSize) facet.
    get tabSize() { return this.facet(EditorState.tabSize); }
    /// Get the proper [line-break](#state.EditorState^lineSeparator)
    /// string for this state.
    get lineBreak() { return this.facet(EditorState.lineSeparator) || "\n"; }
    /// The _column width_ of an indent unit in the document. Determined
    /// by the [`indentUnit`](#state.EditorState^indentUnit) facet, and
    /// [`tabSize`](#state.EditorState^tabSize) when that contains tabs.
    get indentUnit() {
        let unit = this.facet(EditorState.indentUnit);
        return unit.charCodeAt(0) == 9 ? this.tabSize * unit.length : unit.length;
    }
    /// Whether indentation should use tabs. Will be true when the
    /// [`indentUnit`](#state.EditorState^indentUnit) facet contains
    /// tabs.
    get indentWithTabs() { return this.facet(EditorState.indentUnit).charCodeAt(0) == 9; }
    /// Look up a translation for the given phrase (via the
    /// [`phrases`](#state.EditorState^phrases) facet), or return the
    /// original string if no translation is found.
    phrase(phrase) {
        for (let map of this.facet(EditorState.phrases))
            if (Object.prototype.hasOwnProperty.call(map, phrase))
                return map[phrase];
        return phrase;
    }
    /// Return a function that can categorize strings (expected to
    /// represent a single [grapheme cluster](#text.nextClusterBreak))
    /// into one of:
    ///
    ///  - Word (contains an alphanumeric character or a character
    ///    explicitly listed in the local language's `"wordChars"`
    ///    language data, which should be a string)
    ///  - Space (contains only whitespace)
    ///  - Other (anything else)
    charCategorizer(at) {
        return makeCategorizer(this.languageDataAt("wordChars", at).join(""));
    }
    /// Get the syntax tree for this state, which is the current
    /// (possibly incomplete) parse tree of the [syntax](#state.Syntax)
    /// with the highest precedence, or the empty tree if there is no
    /// syntax available.
    get tree() {
        let syntax = this.facet(EditorState.syntax);
        return syntax.length ? syntax[0].getTree(this) : Tree.empty;
    }
    /// Find the values for a given language data field, either provided
    /// by the [syntax](#state.languageData) or through the
    /// [`addLanguageData`](#state.EditorState^addLanguageData) facet,
    /// for the [document type](#state.Syntax.docNodeTypeAt) at the
    /// given position. Values provided by the facet, in precedence
    /// order, will appear before those provided by the syntax.
    languageDataAt(name, pos) {
        let values = null;
        let syntax = this.facet(EditorState.syntax);
        let type = syntax.length ? syntax[0].docNodeTypeAt(this, pos) : null;
        for (let added of this.facet(addLanguageData)) {
            if ((added.type == null || added.type == type) && Object.prototype.hasOwnProperty.call(added, name))
                (values || (values = [])).push(added[name]);
        }
        if (type) {
            let langData = type.prop(languageData);
            if (langData && Object.prototype.hasOwnProperty.call(langData, name))
                (values || (values = [])).push(langData[name]);
        }
        return values || none$1;
    }
}
/// A facet that, when enabled, causes the editor to allow multiple
/// ranges to be selected. You should probably not use this
/// directly, but let a plugin like
/// [multiple-selections](#multiple-selections) handle it (which
/// also makes sure the selections are visible in the view).
EditorState.allowMultipleSelections = allowMultipleSelections;
/// Facet that defines a way to query for automatic indentation
/// depth at the start of a given line.
EditorState.indentation = Facet.define();
/// Configures the tab size to use in this state. The first
/// (highest-precedence) value of the facet is used. If no value is
/// given, this defaults to 4.
EditorState.tabSize = Facet.define({
    combine: values => values.length ? values[0] : 4
});
/// The line separator to use. By default, any of `"\n"`, `"\r\n"`
/// and `"\r"` is treated as a separator when splitting lines, and
/// lines are joined with `"\n"`.
///
/// When you configure a value here, only that precise separator
/// will be used, allowing you to round-trip documents through the
/// editor without normalizing line separators.
EditorState.lineSeparator = Facet.define({
    combine: values => values.length ? values[0] : undefined,
    static: true
});
/// Facet for overriding the unit by which indentation happens.
/// Should be a string consisting either entirely of spaces or
/// entirely of tabs. When not set, this defaults to 2 spaces.
EditorState.indentUnit = Facet.define({
    combine: values => {
        if (!values.length)
            return "  ";
        if (!/^(?: +|\t+)$/.test(values[0]))
            throw new Error("Invalid indent unit: " + JSON.stringify(values[0]));
        return values[0];
    }
});
/// Registers translation phrases. The
/// [`phrase`](#state.EditorState.phrase) method will look through
/// all objects registered with this facet to find translations for
/// its argument.
EditorState.phrases = Facet.define();
/// Facet that registers a parsing service for the state.
EditorState.syntax = Facet.define();
/// A facet used to register extra [language
/// data](#state.EditorState.languageDataAt) with a language. Values
/// are objects with the target [document
/// type](#state.Syntax.docNodeType) in their `type` property, and any
/// associated data in other properties.
EditorState.addLanguageData = addLanguageData;
/// A facet that registers a code folding service. When called with
/// the extent of a line, such a function should return a range
/// object when a foldable that starts on that line (but continues
/// beyond it), if one can be found.
EditorState.foldable = Facet.define();
/// Facet used to register change filters, which are called for each
/// transaction (unless explicitly
/// [disabled](#state.TransactionSpec.filter)), and can suppress
/// part of the transaction's changes.
///
/// Such a function can return `true` to indicate that it doesn't
/// want to do anything, `false` to completely stop the changes in
/// the transaction, or a set of ranges in which changes should be
/// suppressed. Such ranges are represented as an array of numbers,
/// with each pair of two number indicating the start and end of a
/// range. So for example `[10, 20, 100, 110]` suppresses changes
/// between 10 and 20, and between 100 and 110.
EditorState.changeFilter = changeFilter;
/// Facet used to register a hook that gets a chance to update or
/// replace transaction specs before they are applied. This will
/// only be applied for transactions that don't have
/// [`filter`](#state.TransactionSpec.filter) set to `false`. You
/// can either return a single spec (possibly the input spec), or an
/// array of specs (which will be combined in the same way as the
/// arguments to [`EditorState.update`](#state.EditorState.update)).
///
/// (This functionality should be used with care. Indiscriminately
/// modifying transaction is likely to break something or degrade
/// the user experience.)
EditorState.transactionFilter = transactionFilter;
const none$1 = [];

/// Utility function for combining behaviors to fill in a config
/// object from an array of provided configs. Will, by default, error
/// when a field gets two values that aren't ===-equal, but you can
/// provide combine functions per field to do something else.
function combineConfig(configs, defaults, // Should hold only the optional properties of Config, but I haven't managed to express that
combine = {}) {
    let result = {};
    for (let config of configs)
        for (let key of Object.keys(config)) {
            let value = config[key], current = result[key];
            if (current === undefined)
                result[key] = value;
            else if (current === value || value === undefined) ; // No conflict
            else if (Object.hasOwnProperty.call(combine, key))
                result[key] = combine[key](current, value);
            else
                throw new Error("Config merge conflict for field " + key);
        }
    for (let key in defaults)
        if (result[key] === undefined)
            result[key] = defaults[key];
    return result;
}
/// Defaults the fields in a configuration object to values given in
/// `defaults` if they are not already present.
function fillConfig(config, defaults) {
    let result = {};
    for (let key in config)
        result[key] = config[key];
    for (let key in defaults)
        if (result[key] === undefined)
            result[key] = defaults[key];
    return result;
}

function sym(name, random) {
  return typeof Symbol == "undefined"
    ? "__" + name + (random ? Math.floor(Math.random() * 1e8) : "")
    : random ? Symbol(name) : Symbol.for(name)
}

const COUNT = sym("\u037c"), SET = sym("styleSet", 1), RULES = sym("rules", 1);
const top = typeof global == "undefined" ? window : global;

// :: (Object<Style>, ?{generateClasses: ?boolean}) → StyleModule
// Instances of this class bind the property names from `spec` to CSS
// class names that assign the styles in the corresponding property
// values, unless `generateClasses` is `false`, in which case the
// property names in the spec are treated as plain CSS selectors.
//
// A style module can only be used in a given DOM root after it has
// been _mounted_ there with `StyleModule.mount`.
//
// Style modules should be created once and stored somewhere, as
// opposed to re-creating them every time you need them. The amount of
// CSS rules generated for a given DOM root is bounded by the amount
// of style modules that were used. So to avoid leaking rules, don't
// create these dynamically, but treat them as one-time allocations.
function StyleModule(spec, options) {
  this[RULES] = [];
  for (let name in spec) {
    let style = spec[name], specificity = style.specificity || 0;
    let id = StyleModule.newName(), selector = name;
    if ((options && options.generateClasses) !== false) {
      let className = id;
      selector = "." + id;
      for (let i = 0; i < specificity; i++) {
        let name = "\u037c_" + (i ? i.toString(36) : "");
        selector += "." + name;
        className += " " + name;
      }
      this[name] = className;
    }
    renderStyle(selector, spec[name], this[RULES]);
  }
}

// :: () → string
// Generate a new unique CSS class name.
StyleModule.newName = () => {
  let id = top[COUNT] || 1;
  top[COUNT] = id + 1;
  return "\u037c" + id.toString(36)
};

StyleModule.prototype = Object.create(null);

// :: (union<Document, ShadowRoot>, union<[StyleModule], StyleModule>)
//
// Mount the given set of modules in the given DOM root, which ensures
// that the CSS rules defined by the module are available in that
// context.
//
// Rules are only added to the document once per root.
//
// Rule order will follow the order of the modules, so that rules from
// modules later in the array take precedence of those from earlier
// modules. If you call this function multiple times for the same root
// in a way that changes the order of already mounted modules, the old
// order will be changed.
StyleModule.mount = function(root, modules) {
  (root[SET] || new StyleSet(root)).mount(Array.isArray(modules) ? modules : [modules]);
};

class StyleSet {
  constructor(root) {
    this.root = root;
    root[SET] = this;
    this.styleTag = (root.ownerDocument || root).createElement("style");
    let target = root.head || root;
    target.insertBefore(this.styleTag, target.firstChild);
    this.modules = [];
  }

  mount(modules) {
    let sheet = this.styleTag.sheet, reset = !sheet;
    let pos = 0 /* Current rule offset */, j = 0; /* Index into this.modules */
    for (let i = 0; i < modules.length; i++) {
      let mod = modules[i], index = this.modules.indexOf(mod);
      if (index < j && index > -1) { // Ordering conflict
        this.modules.splice(index, 1);
        j--;
        index = -1;
      }
      if (index == -1) {
        this.modules.splice(j++, 0, mod);
        if (!reset) for (let k = 0; k < mod[RULES].length; k++)
          sheet.insertRule(mod[RULES][k], pos++);
      } else {
        while (j < index) pos += this.modules[j++][RULES].length;
        pos += mod[RULES].length;
        j++;
      }
    }

    if (reset) {
      let text = "";
      for (let i = 0; i < this.modules.length; i++)
        text += this.modules[i][RULES].join("\n") + "\n";
      this.styleTag.textContent = text;
    }
  }
}

function renderStyle(selector, spec, output) {
  if (typeof spec != "object") throw new RangeError("Expected style object, got " + JSON.stringify(spec))
  let props = [];
  for (let prop in spec) {
    if (/^@/.test(prop)) {
      let local = [];
      renderStyle(selector, spec[prop], local);
      output.push(prop + " {" + local.join(" ") + "}");
    } else if (/&/.test(prop)) {
      renderStyle(prop.replace(/&/g, selector), spec[prop], output);
    } else if (prop != "specificity") {
      if (typeof spec[prop] == "object") throw new RangeError("The value of a property (" + prop + ") should be a primitive value.")
      props.push(prop.replace(/_.*/, "").replace(/[A-Z]/g, l => "-" + l.toLowerCase()) + ": " + spec[prop]);
    }
  }
  if (props.length) output.push(selector + " {" + props.join("; ") + "}");
}

// Style::Object<union<Style,string>>
//
// A style is an object that, in the simple case, maps CSS property
// names to strings holding their values, as in `{color: "red",
// fontWeight: "bold"}`. The property names can be given in
// camel-case—the library will insert a dash before capital letters
// when converting them to CSS.
//
// If you include an underscore in a property name, it and everything
// after it will be removed from the output, which can be useful when
// providing a property multiple times, for browser compatibility
// reasons.
//
// A property called `specificity` has a special meaning: if it holds
// a number _N_, greater than 0, the selector for the class will have
// _N_ extra dummy classes added, and those dummy classes will also be
// present in the class name string created for the style. This allows
// you to create rules that take precedence over other rules, even
// when they are defined earlier.
//
// A property in a style object can also be a sub-selector, which
// extends the current context to add a pseudo-selector or a child
// selector. Such a property should contain a `&` character, which
// will be replaced by the current selector. For example `{"&:before":
// {content: '"hi"'}}`. Sub-selectors and regular properties can
// freely be mixed in a given object. Any property containing a `&` is
// assumed to be a sub-selector.
//
// Finally, a property can specify an @-block to be wrapped around the
// styles defined inside the object that's the property's value. For
// example to create a media query you can do `{"@media screen and
// (min-width: 400px)": {...}}`.

/// Each range is associated with a value, which must inherit from
/// this class.
class RangeValue {
    /// Compare this value with another value. The default
    /// implementation compares by identity.
    eq(other) { return this == other; }
    /// Create a [range](#rangeset.Range) with this value.
    range(from, to = from) { return new Range(from, to, this); }
}
RangeValue.prototype.startSide = RangeValue.prototype.endSide = 0;
RangeValue.prototype.point = false;
RangeValue.prototype.mapMode = MapMode.TrackDel;
/// A range associates a value with a range of positions.
class Range {
    /// @internal
    constructor(
    /// The range's start position.
    from, 
    /// Its end position.
    to, 
    /// The value associated with this range.
    value) {
        this.from = from;
        this.to = to;
        this.value = value;
    }
}
function cmpRange(a, b) {
    return a.from - b.from || a.value.startSide - b.value.startSide;
}
// The maximum amount of ranges to store in a single chunk
const ChunkSize = 250, 
// Chunks with points of this size are never skipped during
// compare, since moving past those points is likely to speed
// up, rather than slow down, the comparison.
BigPointSize = 500, 
// A large (fixnum) value to use for max/min values.
Far = 1e9;
class Chunk {
    constructor(from, to, value, 
    // Chunks are marked with the largest point that occurs
    // in them (or -1 for no points), so that scans that are
    // only interested in points (such as the
    // heightmap-related logic) can skip range-only chunks.
    maxPoint) {
        this.from = from;
        this.to = to;
        this.value = value;
        this.maxPoint = maxPoint;
    }
    get length() { return this.to[this.to.length - 1]; }
    // With side == -1, return the first index where to >= pos. When
    // side == 1, the first index where from > pos.
    findIndex(pos, end, side = end * Far, startAt = 0) {
        if (pos <= 0)
            return startAt;
        let arr = end < 0 ? this.to : this.from;
        for (let lo = startAt, hi = arr.length;;) {
            if (lo == hi)
                return lo;
            let mid = (lo + hi) >> 1;
            let diff = arr[mid] - pos || (end < 0 ? this.value[mid].startSide : this.value[mid].endSide) - side;
            if (mid == lo)
                return diff >= 0 ? lo : hi;
            if (diff >= 0)
                hi = mid;
            else
                lo = mid + 1;
        }
    }
    between(offset, from, to, f) {
        for (let i = this.findIndex(from, -1), e = this.findIndex(to, 1, undefined, i); i < e; i++)
            if (f(this.from[i] + offset, this.to[i] + offset, this.value[i]) === false)
                return false;
    }
    map(offset, changes) {
        let value = [], from = [], to = [], newPos = -1, maxPoint = -1;
        for (let i = 0; i < this.value.length; i++) {
            let val = this.value[i], curFrom = this.from[i] + offset, curTo = this.to[i] + offset, newFrom, newTo;
            if (curFrom == curTo) {
                let mapped = changes.mapPos(curFrom, val.startSide, val.mapMode);
                if (mapped < 0)
                    continue;
                newFrom = newTo = mapped;
            }
            else {
                newFrom = changes.mapPos(curFrom, val.startSide);
                newTo = changes.mapPos(curTo, val.endSide);
                if (newFrom > newTo || newFrom == newTo && val.startSide > 0 && val.endSide <= 0)
                    continue;
            }
            if ((newTo - newFrom || val.endSide - val.startSide) < 0)
                continue;
            if (newPos < 0)
                newPos = newFrom;
            if (val.point)
                maxPoint = Math.max(maxPoint, newTo - newFrom);
            value.push(val);
            from.push(newFrom - newPos);
            to.push(newTo - newPos);
        }
        return { mapped: value.length ? new Chunk(from, to, value, maxPoint) : null, pos: newPos };
    }
}
/// A range set stores a collection of [ranges](#rangeset.Range) in a
/// way that makes them efficient to [map](#rangeset.RangeSet.map) and
/// [update](#rangeset.RangeSet.update). This is an immutable data
/// structure.
class RangeSet {
    /// @internal
    constructor(
    /// @internal
    chunkPos, 
    /// @internal
    chunk, 
    /// @internal
    nextLayer = RangeSet.empty, 
    /// @internal
    maxPoint) {
        this.chunkPos = chunkPos;
        this.chunk = chunk;
        this.nextLayer = nextLayer;
        this.maxPoint = maxPoint;
    }
    /// @internal
    get length() {
        let last = this.chunk.length - 1;
        return last < 0 ? 0 : Math.max(this.chunkEnd(last), this.nextLayer.length);
    }
    /// @internal
    get size() {
        if (this == RangeSet.empty)
            return 0;
        let size = this.nextLayer.size;
        for (let chunk of this.chunk)
            size += chunk.value.length;
        return size;
    }
    /// @internal
    chunkEnd(index) {
        return this.chunkPos[index] + this.chunk[index].length;
    }
    /// Update the range set, optionally adding new ranges or filtering
    /// out existing ones.
    update({ add = [], sort = false, filter, filterFrom = 0, filterTo = this.length }) {
        if (add.length == 0 && !filter)
            return this;
        if (sort)
            add.slice().sort(cmpRange);
        if (this == RangeSet.empty)
            return add.length ? RangeSet.of(add) : this;
        let cur = new LayerCursor(this, null, -1).goto(0), i = 0, spill = [];
        let builder = new RangeSetBuilder();
        while (cur.value || i < add.length) {
            if (i < add.length && (cur.from - add[i].from || cur.startSide - add[i].value.startSide) >= 0) {
                let range = add[i++];
                if (!builder.addInner(range.from, range.to, range.value))
                    spill.push(range);
            }
            else if (cur.rangeIndex == 1 && cur.chunkIndex < this.chunk.length &&
                (i == add.length || this.chunkEnd(cur.chunkIndex) < add[i].from) &&
                (!filter || filterFrom > this.chunkEnd(cur.chunkIndex) || filterTo < this.chunkPos[cur.chunkIndex]) &&
                builder.addChunk(this.chunkPos[cur.chunkIndex], this.chunk[cur.chunkIndex])) {
                cur.nextChunk();
            }
            else {
                if (!filter || filterFrom > cur.to || filterTo < cur.from || filter(cur.from, cur.to, cur.value)) {
                    if (!builder.addInner(cur.from, cur.to, cur.value))
                        spill.push(new Range(cur.from, cur.to, cur.value));
                }
                cur.next();
            }
        }
        return builder.finishInner(this.nextLayer == RangeSet.empty && !spill.length ? RangeSet.empty
            : this.nextLayer.update({ add: spill, filter, filterFrom, filterTo }));
    }
    /// Map this range set through a set of changes, return the new set.
    map(changes) {
        if (changes.length == 0 || this == RangeSet.empty)
            return this;
        let chunks = [], chunkPos = [], maxPoint = -1;
        for (let i = 0; i < this.chunk.length; i++) {
            let start = this.chunkPos[i], chunk = this.chunk[i];
            let touch = changes.touchesRange(start, start + chunk.length);
            if (touch === false) {
                maxPoint = Math.max(maxPoint, chunk.maxPoint);
                chunks.push(chunk);
                chunkPos.push(changes.mapPos(start));
            }
            else if (touch === true) {
                let { mapped, pos } = chunk.map(start, changes);
                if (mapped) {
                    maxPoint = Math.max(maxPoint, mapped.maxPoint);
                    chunks.push(mapped);
                    chunkPos.push(pos);
                }
            }
        }
        let next = this.nextLayer.map(changes);
        return chunks.length == 0 ? next : new RangeSet(chunkPos, chunks, next, maxPoint);
    }
    /// Iterate over the ranges that touch the region `from` to `to`,
    /// calling `f` for each. There is no guarantee that the ranges will
    /// be reported in any order. When the callback returns `false`,
    /// iteration stops.
    between(from, to, f) {
        if (this == RangeSet.empty)
            return;
        for (let i = 0; i < this.chunk.length; i++) {
            let start = this.chunkPos[i], chunk = this.chunk[i];
            if (to >= start && from <= start + chunk.length &&
                chunk.between(start, from - start, to - start, f) === false)
                return;
        }
        this.nextLayer.between(from, to, f);
    }
    /// Iterate over the ranges in this set, in order, including all
    /// ranges that end at or after `from`.
    iter(from = 0) {
        return HeapCursor.from([this]).goto(from);
    }
    /// Iterate over the given sets, starting from `from`.
    static iter(sets, from = 0) {
        return HeapCursor.from(sets).goto(from);
    }
    /// Iterate over two groups of sets, calling methods on `comparator`
    /// to notify it of possible differences. `textDiff` indicates how
    /// the underlying data changed between these ranges, and is needed
    /// to synchronize the iteration. `from` and `to` are coordinates in
    /// the _new_ space, after these changes.
    static compare(oldSets, newSets, textDiff, comparator) {
        var _a;
        let minPoint = (_a = comparator.minPointSize) !== null && _a !== void 0 ? _a : -1;
        let a = oldSets.filter(set => set.maxPoint >= BigPointSize ||
            set != RangeSet.empty && newSets.indexOf(set) < 0 && set.maxPoint >= minPoint);
        let b = newSets.filter(set => set.maxPoint >= BigPointSize ||
            set != RangeSet.empty && oldSets.indexOf(set) < 0 && set.maxPoint >= minPoint);
        let sharedChunks = findSharedChunks(a, b);
        let sideA = new SpanCursor(a, sharedChunks, minPoint);
        let sideB = new SpanCursor(b, sharedChunks, minPoint);
        textDiff.iterGaps((fromA, fromB, length) => compare(sideA, fromA, sideB, fromB, length, comparator));
        if (textDiff.empty && textDiff.length == 0)
            compare(sideA, 0, sideB, 0, 0, comparator);
    }
    /// Iterate over a group of range sets at the same time, notifying
    /// the iterator about the ranges covering every given piece of
    /// content.
    static spans(sets, from, to, iterator) {
        var _a;
        let cursor = new SpanCursor(sets, null, (_a = iterator.minPointSize) !== null && _a !== void 0 ? _a : -1).goto(from), pos = from;
        for (;;) {
            let curTo = Math.min(cursor.to, to);
            if (cursor.point)
                iterator.point(pos, curTo, cursor.point, cursor.pointFrom < from, cursor.to > to);
            else if (curTo > pos)
                iterator.span(pos, curTo, cursor.active);
            if (cursor.to > to)
                break;
            pos = cursor.to;
            cursor.next();
        }
    }
    /// Create a range set for the given range or array of ranges. By
    /// default, this expects the ranges to be _sorted_ (by start
    /// position and, if two start at the same position,
    /// `value.startSide`). You can pass `true` as second argument to
    /// cause the method to sort them.
    static of(ranges, sort = false) {
        let build = new RangeSetBuilder();
        for (let range of ranges instanceof Range ? [ranges] : sort ? ranges.slice().sort(cmpRange) : ranges)
            build.add(range.from, range.to, range.value);
        return build.finish();
    }
}
/// The empty set of ranges.
RangeSet.empty = new RangeSet([], [], null, -1);
RangeSet.empty.nextLayer = RangeSet.empty;
/// A range set builder is a data structure that helps build up a
/// [range set](#rangeset.RangeSet) directly, without first allocating
/// an array of [`Range`](#rangeset.Range) objects.
class RangeSetBuilder {
    constructor() {
        this.chunks = [];
        this.chunkPos = [];
        this.chunkStart = -1;
        this.last = null;
        this.lastFrom = -Far;
        this.lastTo = -Far;
        this.from = [];
        this.to = [];
        this.value = [];
        this.maxPoint = -1;
        this.setMaxPoint = -1;
        this.nextLayer = null;
    }
    finishChunk(newArrays) {
        this.chunks.push(new Chunk(this.from, this.to, this.value, this.maxPoint));
        this.chunkPos.push(this.chunkStart);
        this.chunkStart = -1;
        this.setMaxPoint = Math.max(this.setMaxPoint, this.maxPoint);
        this.maxPoint = -1;
        if (newArrays) {
            this.from = [];
            this.to = [];
            this.value = [];
        }
    }
    /// Add a range. Ranges should be added in sorted (by `from` and
    /// `value.startSide`) order.
    add(from, to, value) {
        if (!this.addInner(from, to, value))
            (this.nextLayer || (this.nextLayer = new RangeSetBuilder)).add(from, to, value);
    }
    /// @internal
    addInner(from, to, value) {
        let diff = from - this.lastTo || value.startSide - this.last.endSide;
        if (diff <= 0 && (from - this.lastFrom || value.startSide - this.last.startSide) < 0)
            throw new Error("Ranges must be added sorted by `from` position and `startSide`");
        if (diff < 0)
            return false;
        if (this.from.length == ChunkSize)
            this.finishChunk(true);
        if (this.chunkStart < 0)
            this.chunkStart = from;
        this.from.push(from - this.chunkStart);
        this.to.push(to - this.chunkStart);
        this.last = value;
        this.lastFrom = from;
        this.lastTo = to;
        this.value.push(value);
        if (value.point)
            this.maxPoint = Math.max(this.maxPoint, to - from);
        return true;
    }
    /// @internal
    addChunk(from, chunk) {
        if ((from - this.lastTo || chunk.value[0].startSide - this.last.endSide) < 0)
            return false;
        if (this.from.length)
            this.finishChunk(true);
        this.setMaxPoint = Math.max(this.setMaxPoint, chunk.maxPoint);
        this.chunks.push(chunk);
        this.chunkPos.push(from);
        let last = chunk.value.length - 1;
        this.last = chunk.value[last];
        this.lastFrom = chunk.from[last] + from;
        this.lastTo = chunk.to[last] + from;
        return true;
    }
    /// Finish the range set. Returns the new set. The builder can't be
    /// used anymore after this has been called.
    finish() { return this.finishInner(RangeSet.empty); }
    /// @internal
    finishInner(next) {
        if (this.from.length)
            this.finishChunk(false);
        if (this.chunks.length == 0)
            return next;
        let result = new RangeSet(this.chunkPos, this.chunks, this.nextLayer ? this.nextLayer.finishInner(next) : next, this.setMaxPoint);
        this.from = null; // Make sure further `add` calls produce errors
        return result;
    }
}
function findSharedChunks(a, b) {
    let inA = new Map();
    for (let set of a)
        for (let i = 0; i < set.chunk.length; i++)
            if (set.chunk[i].maxPoint < BigPointSize)
                inA.set(set.chunk[i], set.chunkPos[i]);
    let shared = new Set();
    for (let set of b)
        for (let i = 0; i < set.chunk.length; i++)
            if (inA.get(set.chunk[i]) == set.chunkPos[i])
                shared.add(set.chunk[i]);
    return shared;
}
class LayerCursor {
    constructor(layer, skip, minPoint) {
        this.layer = layer;
        this.skip = skip;
        this.minPoint = minPoint;
    }
    get startSide() { return this.value ? this.value.startSide : 0; }
    get endSide() { return this.value ? this.value.endSide : 0; }
    goto(pos, side = -Far) {
        this.chunkIndex = this.rangeIndex = 0;
        this.gotoInner(pos, side, false);
        return this;
    }
    gotoInner(pos, side, forward) {
        while (this.chunkIndex < this.layer.chunk.length) {
            let next = this.layer.chunk[this.chunkIndex];
            if (!(this.skip && this.skip.has(next) ||
                this.layer.chunkEnd(this.chunkIndex) < pos ||
                next.maxPoint < this.minPoint))
                break;
            this.chunkIndex++;
            forward = false;
        }
        let rangeIndex = this.chunkIndex == this.layer.chunk.length ? 0
            : this.layer.chunk[this.chunkIndex].findIndex(pos - this.layer.chunkPos[this.chunkIndex], -1, side);
        if (!forward || this.rangeIndex < rangeIndex)
            this.rangeIndex = rangeIndex;
        this.next();
    }
    forward(pos, side) {
        if ((this.to - pos || this.endSide - side) < 0)
            this.gotoInner(pos, side, true);
    }
    next() {
        for (;;) {
            if (this.chunkIndex == this.layer.chunk.length) {
                this.from = this.to = Far;
                this.value = null;
                break;
            }
            else {
                let chunkPos = this.layer.chunkPos[this.chunkIndex], chunk = this.layer.chunk[this.chunkIndex];
                let from = chunkPos + chunk.from[this.rangeIndex];
                this.from = from;
                this.to = chunkPos + chunk.to[this.rangeIndex];
                this.value = chunk.value[this.rangeIndex];
                if (++this.rangeIndex == chunk.value.length) {
                    this.chunkIndex++;
                    if (this.skip) {
                        while (this.chunkIndex < this.layer.chunk.length && this.skip.has(this.layer.chunk[this.chunkIndex]))
                            this.chunkIndex++;
                    }
                    this.rangeIndex = 0;
                }
                if (this.minPoint < 0 || this.value.point && this.to - this.from >= this.minPoint)
                    break;
            }
        }
    }
    nextChunk() {
        this.chunkIndex++;
        this.rangeIndex = 0;
        this.next();
    }
    compare(other) {
        return this.from - other.from || this.startSide - other.startSide || this.to - other.to || this.endSide - other.endSide;
    }
}
class HeapCursor {
    constructor(heap) {
        this.heap = heap;
    }
    static from(sets, skip = null, minPoint = -1) {
        let heap = [];
        for (let set of sets)
            for (let cur = set; cur != RangeSet.empty; cur = cur.nextLayer) {
                if (cur.maxPoint >= minPoint)
                    heap.push(new LayerCursor(cur, skip, minPoint));
            }
        return heap.length == 1 ? heap[0] : new HeapCursor(heap);
    }
    get startSide() { return this.value ? this.value.startSide : 0; }
    goto(pos, side = -Far) {
        for (let cur of this.heap)
            cur.goto(pos, side);
        for (let i = this.heap.length >> 1; i >= 0; i--)
            heapBubble(this.heap, i);
        this.next();
        return this;
    }
    forward(pos, side) {
        for (let cur of this.heap)
            cur.forward(pos, side);
        for (let i = this.heap.length >> 1; i >= 0; i--)
            heapBubble(this.heap, i);
        if ((this.to - pos || this.value.endSide - side) < 0)
            this.next();
    }
    next() {
        if (this.heap.length == 0) {
            this.from = this.to = Far;
            this.value = null;
        }
        else {
            let top = this.heap[0];
            this.from = top.from;
            this.to = top.to;
            this.value = top.value;
            if (top.value)
                top.next();
            heapBubble(this.heap, 0);
        }
    }
}
function heapBubble(heap, index) {
    for (let cur = heap[index];;) {
        let childIndex = (index << 1) + 1;
        if (childIndex >= heap.length)
            break;
        let child = heap[childIndex];
        if (childIndex + 1 < heap.length && child.compare(heap[childIndex + 1]) >= 0) {
            child = heap[childIndex + 1];
            childIndex++;
        }
        if (cur.compare(child) < 0)
            break;
        heap[childIndex] = cur;
        heap[index] = child;
        index = childIndex;
    }
}
class SpanCursor {
    constructor(sets, skip, minPoint) {
        this.minPoint = minPoint;
        this.active = [];
        this.activeTo = [];
        this.minActive = -1;
        // A currently active point range, if any
        this.point = null;
        this.pointFrom = 0;
        this.to = -Far;
        this.endSide = 0;
        this.cursor = HeapCursor.from(sets, skip, minPoint);
    }
    goto(pos, side = -Far) {
        this.cursor.goto(pos, side);
        this.active.length = this.activeTo.length = 0;
        this.minActive = -1;
        this.to = pos;
        this.endSide = side;
        this.next();
        return this;
    }
    forward(pos, side) {
        while (this.minActive > -1 && (this.activeTo[this.minActive] - pos || this.active[this.minActive].endSide - side) < 0)
            this.removeActive(this.minActive);
        this.cursor.forward(pos, side);
    }
    removeActive(index) {
        remove(this.active, index);
        remove(this.activeTo, index);
        this.minActive = findMinIndex(this.active, this.activeTo);
    }
    // After calling this, if `this.point` != null, the next range is a
    // point. Otherwise, it's a regular range, covered by `this.active`.
    next() {
        let from = this.to;
        this.point = null;
        for (;;) {
            let a = this.minActive;
            if (a > -1 && (this.activeTo[a] - this.cursor.from || this.active[a].endSide - this.cursor.startSide) < 0) {
                if (this.activeTo[a] > from) {
                    this.to = this.activeTo[a];
                    this.endSide = this.active[a].endSide;
                    break;
                }
                this.removeActive(a);
            }
            else if (!this.cursor.value) {
                this.to = this.endSide = Far;
                break;
            }
            else if (this.cursor.from > from) {
                this.to = this.cursor.from;
                this.endSide = this.cursor.startSide;
                break;
            }
            else {
                let nextVal = this.cursor.value;
                if (!nextVal.point) { // Opening a range
                    this.active.push(nextVal);
                    this.activeTo.push(this.cursor.to);
                    this.minActive = findMinIndex(this.active, this.activeTo);
                    this.cursor.next();
                }
                else { // New point
                    this.point = nextVal;
                    this.pointFrom = this.cursor.from;
                    this.to = this.cursor.to;
                    this.endSide = nextVal.endSide;
                    this.cursor.next();
                    if (this.to > from)
                        this.forward(this.to, this.endSide);
                    break;
                }
            }
        }
    }
}
function compare(a, startA, b, startB, length, comparator) {
    a.goto(startA);
    b.goto(startB);
    let endB = startB + length;
    let pos = startB, dPos = startB - startA;
    for (;;) {
        let diff = (a.to + dPos) - b.to || a.endSide - b.endSide;
        let end = diff < 0 ? a.to + dPos : b.to, clipEnd = Math.min(end, endB);
        if (a.point || b.point) {
            if (!(a.point && b.point && (a.point == b.point || a.point.eq(b.point))))
                comparator.comparePoint(pos, clipEnd, a.point, b.point);
        }
        else {
            if (clipEnd > pos && !sameSet(a.active, b.active))
                comparator.compareRange(pos, clipEnd, a.active, b.active);
        }
        if (end > endB)
            break;
        pos = end;
        if (diff <= 0)
            a.next();
        if (diff >= 0)
            b.next();
    }
}
function sameSet(a, b) {
    if (a.length != b.length)
        return false;
    outer: for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b.length; j++)
            if (a[i] == b[i] || a[i].eq(b[j]))
                continue outer;
        return false;
    }
    return true;
}
function remove(array, index) {
    let last = array.pop();
    if (index != array.length)
        array[index] = last;
}
function findMinIndex(value, array) {
    let found = -1, foundPos = Far;
    for (let i = 0; i < array.length; i++)
        if ((array[i] - foundPos || value[i].endSide - value[found].endSide) < 0) {
            found = i;
            foundPos = array[i];
        }
    return found;
}

let [nav, doc] = typeof navigator != "undefined"
    ? [navigator, document]
    : [{ userAgent: "", vendor: "", platform: "" }, { documentElement: { style: {} } }];
const ie_edge = /Edge\/(\d+)/.exec(nav.userAgent);
const ie_upto10 = /MSIE \d/.test(nav.userAgent);
const ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(nav.userAgent);
const ie = !!(ie_upto10 || ie_11up || ie_edge);
const gecko = !ie && /gecko\/(\d+)/i.test(nav.userAgent);
const chrome = !ie && /Chrome\/(\d+)/.exec(nav.userAgent);
const webkit = "webkitFontSmoothing" in doc.documentElement.style;
var browser = {
    mac: /Mac/.test(nav.platform),
    ie,
    ie_version: ie_upto10 ? doc.documentMode || 6 : ie_11up ? +ie_11up[1] : ie_edge ? +ie_edge[1] : 0,
    gecko,
    gecko_version: gecko ? +(/Firefox\/(\d+)/.exec(nav.userAgent) || [0, 0])[1] : 0,
    chrome: !!chrome,
    chrome_version: chrome ? +chrome[1] : 0,
    ios: !ie && /AppleWebKit/.test(nav.userAgent) && /Mobile\/\w+/.test(nav.userAgent),
    android: /Android\b/.test(nav.userAgent),
    webkit,
    safari: /Apple Computer/.test(nav.vendor),
    webkit_version: webkit ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0,
    tabSize: doc.documentElement.style.tabSize != null ? "tab-size" : "-moz-tab-size"
};

function getSelection(root) {
    return (root.getSelection ? root.getSelection() : document.getSelection());
}
// Work around Chrome issue https://bugs.chromium.org/p/chromium/issues/detail?id=447523
// (isCollapsed inappropriately returns true in shadow dom)
function selectionCollapsed(domSel) {
    let collapsed = domSel.isCollapsed;
    if (collapsed && browser.chrome && domSel.rangeCount && !domSel.getRangeAt(0).collapsed)
        collapsed = false;
    return collapsed;
}
function hasSelection(dom, selection) {
    if (!selection.anchorNode)
        return false;
    try {
        // Firefox will raise 'permission denied' errors when accessing
        // properties of `sel.anchorNode` when it's in a generated CSS
        // element.
        return dom.contains(selection.anchorNode.nodeType == 3 ? selection.anchorNode.parentNode : selection.anchorNode);
    }
    catch (_) {
        return false;
    }
}
function clientRectsFor(dom) {
    if (dom.nodeType == 3) {
        let range = document.createRange();
        range.setEnd(dom, dom.nodeValue.length);
        range.setStart(dom, 0);
        return range.getClientRects();
    }
    else if (dom.nodeType == 1) {
        return dom.getClientRects();
    }
    else {
        return [];
    }
}
// Scans forward and backward through DOM positions equivalent to the
// given one to see if the two are in the same place (i.e. after a
// text node vs at the end of that text node)
function isEquivalentPosition(node, off, targetNode, targetOff) {
    return targetNode ? (scanFor(node, off, targetNode, targetOff, -1) ||
        scanFor(node, off, targetNode, targetOff, 1)) : false;
}
function domIndex(node) {
    for (var index = 0;; index++) {
        node = node.previousSibling;
        if (!node)
            return index;
    }
}
function scanFor(node, off, targetNode, targetOff, dir) {
    for (;;) {
        if (node == targetNode && off == targetOff)
            return true;
        if (off == (dir < 0 ? 0 : maxOffset(node))) {
            if (node.nodeName == "DIV")
                return false;
            let parent = node.parentNode;
            if (!parent || parent.nodeType != 1)
                return false;
            off = domIndex(node) + (dir < 0 ? 0 : 1);
            node = parent;
        }
        else if (node.nodeType == 1) {
            node = node.childNodes[off + (dir < 0 ? -1 : 0)];
            off = dir < 0 ? maxOffset(node) : 0;
        }
        else {
            return false;
        }
    }
}
function maxOffset(node) {
    return node.nodeType == 3 ? node.nodeValue.length : node.childNodes.length;
}
function windowRect(win) {
    return { left: 0, right: win.innerWidth,
        top: 0, bottom: win.innerHeight };
}
const ScrollSpace = 5;
function scrollRectIntoView(dom, rect) {
    let doc = dom.ownerDocument, win = doc.defaultView;
    for (let cur = dom.parentNode; cur;) {
        if (cur.nodeType == 1) { // Element
            let bounding, top = cur == document.body;
            if (top) {
                bounding = windowRect(win);
            }
            else {
                if (cur.scrollHeight <= cur.clientHeight && cur.scrollWidth <= cur.clientWidth) {
                    cur = cur.parentNode;
                    continue;
                }
                let rect = cur.getBoundingClientRect();
                // Make sure scrollbar width isn't included in the rectangle
                bounding = { left: rect.left, right: rect.left + cur.clientWidth,
                    top: rect.top, bottom: rect.top + cur.clientHeight };
            }
            let moveX = 0, moveY = 0;
            if (rect.top < bounding.top)
                moveY = -(bounding.top - rect.top + ScrollSpace);
            else if (rect.bottom > bounding.bottom)
                moveY = rect.bottom - bounding.bottom + ScrollSpace;
            if (rect.left < bounding.left)
                moveX = -(bounding.left - rect.left + ScrollSpace);
            else if (rect.right > bounding.right)
                moveX = rect.right - bounding.right + ScrollSpace;
            if (moveX || moveY) {
                if (top) {
                    win.scrollBy(moveX, moveY);
                }
                else {
                    if (moveY) {
                        let start = cur.scrollTop;
                        cur.scrollTop += moveY;
                        moveY = cur.scrollTop - start;
                    }
                    if (moveX) {
                        let start = cur.scrollLeft;
                        cur.scrollLeft += moveX;
                        moveX = cur.scrollLeft - start;
                    }
                    rect = { left: rect.left - moveX, top: rect.top - moveY,
                        right: rect.right - moveX, bottom: rect.bottom - moveY };
                }
            }
            if (top)
                break;
            cur = cur.parentNode;
        }
        else if (cur.nodeType == 11) { // A shadow root
            cur = cur.host;
        }
        else {
            break;
        }
    }
}
class DOMSelection {
    constructor() {
        this.anchorNode = null;
        this.anchorOffset = 0;
        this.focusNode = null;
        this.focusOffset = 0;
    }
    eq(domSel) {
        return this.anchorNode == domSel.anchorNode && this.anchorOffset == domSel.anchorOffset &&
            this.focusNode == domSel.focusNode && this.focusOffset == domSel.focusOffset;
    }
    set(domSel) {
        this.anchorNode = domSel.anchorNode;
        this.anchorOffset = domSel.anchorOffset;
        this.focusNode = domSel.focusNode;
        this.focusOffset = domSel.focusOffset;
    }
}
let preventScrollSupported = null;
// Feature-detects support for .focus({preventScroll: true}), and uses
// a fallback kludge when not supported.
function focusPreventScroll(dom) {
    if (dom.setActive)
        return dom.setActive(); // in IE
    if (preventScrollSupported)
        return dom.focus(preventScrollSupported);
    let stack = [];
    for (let cur = dom; cur; cur = cur.parentNode) {
        stack.push(cur, cur.scrollTop, cur.scrollLeft);
        if (cur == cur.ownerDocument)
            break;
    }
    dom.focus(preventScrollSupported == null ? {
        get preventScroll() {
            preventScrollSupported = { preventScroll: true };
            return true;
        }
    } : undefined);
    if (!preventScrollSupported) {
        preventScrollSupported = false;
        for (let i = 0; i < stack.length;) {
            let elt = stack[i++], top = stack[i++], left = stack[i++];
            if (elt.scrollTop != top)
                elt.scrollTop = top;
            if (elt.scrollLeft != left)
                elt.scrollLeft = left;
        }
    }
}

class DOMPos {
    constructor(node, offset, precise = true) {
        this.node = node;
        this.offset = offset;
        this.precise = precise;
    }
    static before(dom, precise) { return new DOMPos(dom.parentNode, domIndex(dom), precise); }
    static after(dom, precise) { return new DOMPos(dom.parentNode, domIndex(dom) + 1, precise); }
}
const none$2 = [];
class ContentView {
    constructor() {
        this.parent = null;
        this.dom = null;
        this.dirty = 2 /* Node */;
    }
    get editorView() {
        if (!this.parent)
            throw new Error("Accessing view in orphan content view");
        return this.parent.editorView;
    }
    get overrideDOMText() { return null; }
    get posAtStart() {
        return this.parent ? this.parent.posBefore(this) : 0;
    }
    get posAtEnd() {
        return this.posAtStart + this.length;
    }
    posBefore(view) {
        let pos = this.posAtStart;
        for (let child of this.children) {
            if (child == view)
                return pos;
            pos += child.length + child.breakAfter;
        }
        throw new RangeError("Invalid child in posBefore");
    }
    posAfter(view) {
        return this.posBefore(view) + view.length;
    }
    coordsAt(_pos, _side) { return null; }
    sync() {
        if (this.dirty & 2 /* Node */) {
            let parent = this.dom, pos = null;
            for (let child of this.children) {
                if (child.dirty) {
                    let next = pos ? pos.nextSibling : parent.firstChild;
                    if (next && !child.dom && !ContentView.get(next))
                        child.reuseDOM(next);
                    child.sync();
                    child.dirty = 0 /* Not */;
                }
                syncNodeInto(parent, pos, child.dom);
                pos = child.dom;
            }
            let next = pos ? pos.nextSibling : parent.firstChild;
            while (next)
                next = rm(next);
        }
        else if (this.dirty & 1 /* Child */) {
            for (let child of this.children)
                if (child.dirty) {
                    child.sync();
                    child.dirty = 0 /* Not */;
                }
        }
    }
    reuseDOM(_dom) { return false; }
    localPosFromDOM(node, offset) {
        let after;
        if (node == this.dom) {
            after = this.dom.childNodes[offset];
        }
        else {
            let bias = maxOffset(node) == 0 ? 0 : offset == 0 ? -1 : 1;
            for (;;) {
                let parent = node.parentNode;
                if (parent == this.dom)
                    break;
                if (bias == 0 && parent.firstChild != parent.lastChild) {
                    if (node == parent.firstChild)
                        bias = -1;
                    else
                        bias = 1;
                }
                node = parent;
            }
            if (bias < 0)
                after = node;
            else
                after = node.nextSibling;
        }
        if (after == this.dom.firstChild)
            return 0;
        while (after && !ContentView.get(after))
            after = after.nextSibling;
        if (!after)
            return this.length;
        for (let i = 0, pos = 0;; i++) {
            let child = this.children[i];
            if (child.dom == after)
                return pos;
            pos += child.length + child.breakAfter;
        }
    }
    domBoundsAround(from, to, offset = 0) {
        let fromI = -1, fromStart = -1, toI = -1, toEnd = -1;
        for (let i = 0, pos = offset; i < this.children.length; i++) {
            let child = this.children[i], end = pos + child.length;
            if (pos < from && end > to)
                return child.domBoundsAround(from, to, pos);
            if (end >= from && fromI == -1) {
                fromI = i;
                fromStart = pos;
            }
            if (end >= to && toI == -1) {
                toI = i;
                toEnd = end;
                break;
            }
            pos = end + child.breakAfter;
        }
        return { from: fromStart, to: toEnd,
            startDOM: (fromI ? this.children[fromI - 1].dom.nextSibling : null) || this.dom.firstChild,
            endDOM: toI < this.children.length - 1 ? this.children[toI + 1].dom : null };
    }
    // FIXME track precise dirty ranges, to avoid full DOM sync on every touched node?
    markDirty(andParent = false) {
        if (this.dirty & 2 /* Node */)
            return;
        this.dirty |= 2 /* Node */;
        this.markParentsDirty(andParent);
    }
    markParentsDirty(childList) {
        for (let parent = this.parent; parent; parent = parent.parent) {
            if (childList)
                parent.dirty |= 2 /* Node */;
            if (parent.dirty & 1 /* Child */)
                return;
            parent.dirty |= 1 /* Child */;
            childList = false;
        }
    }
    setParent(parent) {
        if (this.parent != parent) {
            this.parent = parent;
            if (this.dirty)
                this.markParentsDirty(true);
        }
    }
    setDOM(dom) {
        this.dom = dom;
        dom.cmView = this;
    }
    get rootView() {
        for (let v = this;;) {
            let parent = v.parent;
            if (!parent)
                return v;
            v = parent;
        }
    }
    replaceChildren(from, to, children = none$2) {
        this.markDirty();
        for (let i = from; i < to; i++)
            this.children[i].parent = null;
        this.children.splice(from, to - from, ...children);
        for (let i = 0; i < children.length; i++)
            children[i].setParent(this);
    }
    ignoreMutation(_rec) { return false; }
    ignoreEvent(_event) { return false; }
    childCursor(pos = this.length) {
        return new ChildCursor(this.children, pos, this.children.length);
    }
    childPos(pos, bias = 1) {
        return this.childCursor().findPos(pos, bias);
    }
    toString() {
        let name = this.constructor.name.replace("View", "");
        return name + (this.children.length ? "(" + this.children.join() + ")" :
            this.length ? "[" + (name == "Text" ? this.text : this.length) + "]" : "") +
            (this.breakAfter ? "#" : "");
    }
    static get(node) { return node.cmView; }
}
ContentView.prototype.breakAfter = 0;
// Remove a DOM node and return its next sibling.
function rm(dom) {
    let next = dom.nextSibling;
    dom.parentNode.removeChild(dom);
    return next;
}
function syncNodeInto(parent, after, dom) {
    let next = after ? after.nextSibling : parent.firstChild;
    if (dom.parentNode == parent)
        while (next != dom)
            next = rm(next);
    else
        parent.insertBefore(dom, next);
}
class ChildCursor {
    constructor(children, pos, i) {
        this.children = children;
        this.pos = pos;
        this.i = i;
        this.off = 0;
    }
    findPos(pos, bias = 1) {
        for (;;) {
            if (pos > this.pos || pos == this.pos &&
                (bias > 0 || this.i == 0 || this.children[this.i - 1].breakAfter)) {
                this.off = pos - this.pos;
                return this;
            }
            let next = this.children[--this.i];
            this.pos -= next.length + next.breakAfter;
        }
    }
}

function combineAttrs(source, target) {
    for (let name in source) {
        if (name == "class" && target.class)
            target.class += " " + source.class;
        else if (name == "style" && target.style)
            target.style += ";" + source.style;
        else
            target[name] = source[name];
    }
    return target;
}
function attrsEq(a, b) {
    if (a == b)
        return true;
    if (!a || !b)
        return false;
    let keysA = Object.keys(a), keysB = Object.keys(b);
    if (keysA.length != keysB.length)
        return false;
    for (let key of keysA) {
        if (keysB.indexOf(key) == -1 || a[key] !== b[key])
            return false;
    }
    return true;
}
function updateAttrs(dom, prev, attrs) {
    if (prev)
        for (let name in prev)
            if (!(attrs && name in attrs))
                dom.removeAttribute(name);
    if (attrs)
        for (let name in attrs)
            if (!(prev && prev[name] == attrs[name]))
                dom.setAttribute(name, attrs[name]);
}

const none$1$1 = [];
class InlineView extends ContentView {
    match(_other) { return false; }
    get children() { return none$1$1; }
    getSide() { return 0; }
}
const MaxJoinLen = 256;
class TextView extends InlineView {
    constructor(text, tagName, clss, attrs) {
        super();
        this.text = text;
        this.tagName = tagName;
        this.attrs = attrs;
        this.textDOM = null;
        this.class = clss;
    }
    get length() { return this.text.length; }
    createDOM(textDOM) {
        let tagName = this.tagName || (this.attrs || this.class ? "span" : null);
        this.textDOM = textDOM || document.createTextNode(this.text);
        if (tagName) {
            let dom = document.createElement(tagName);
            dom.appendChild(this.textDOM);
            if (this.class)
                dom.className = this.class;
            if (this.attrs)
                for (let name in this.attrs)
                    dom.setAttribute(name, this.attrs[name]);
            this.setDOM(dom);
        }
        else {
            this.setDOM(this.textDOM);
        }
    }
    sync() {
        if (!this.dom)
            this.createDOM();
        if (this.textDOM.nodeValue != this.text) {
            this.textDOM.nodeValue = this.text;
            let dom = this.dom;
            if (this.textDOM != dom && (this.dom.firstChild != this.textDOM || dom.lastChild != this.textDOM)) {
                while (dom.firstChild)
                    dom.removeChild(dom.firstChild);
                dom.appendChild(this.textDOM);
            }
        }
    }
    reuseDOM(dom) {
        if (dom.nodeType != 3)
            return false;
        this.createDOM(dom);
        return true;
    }
    merge(from, to = this.length, source = null) {
        if (source &&
            (!(source instanceof TextView) ||
                source.tagName != this.tagName || source.class != this.class ||
                !attrsEq(source.attrs, this.attrs) || this.length - (to - from) + source.length > MaxJoinLen))
            return false;
        this.text = this.text.slice(0, from) + (source ? source.text : "") + this.text.slice(to);
        this.markDirty();
        return true;
    }
    slice(from, to = this.length) {
        return new TextView(this.text.slice(from, to), this.tagName, this.class, this.attrs);
    }
    localPosFromDOM(node, offset) {
        return node == this.textDOM ? offset : offset ? this.text.length : 0;
    }
    domAtPos(pos) { return new DOMPos(this.textDOM, pos); }
    domBoundsAround(_from, _to, offset) {
        return { from: offset, to: offset + this.length, startDOM: this.dom, endDOM: this.dom.nextSibling };
    }
    coordsAt(pos, side) {
        return textCoords(this.textDOM, pos, side, this.length);
    }
}
function textCoords(text, pos, side, length) {
    let from = pos, to = pos;
    if (pos == 0 && side < 0 || pos == length && side >= 0) {
        if (!(browser.webkit || browser.gecko)) { // These browsers reliably return valid rectangles for empty ranges
            if (pos)
                from--;
            else
                to++;
        }
    }
    else {
        if (side < 0)
            from--;
        else
            to++;
    }
    let range = document.createRange();
    range.setEnd(text, to);
    range.setStart(text, from);
    return range.getBoundingClientRect();
}
// Also used for collapsed ranges that don't have a placeholder widget!
class WidgetView extends InlineView {
    constructor(widget, length, side, open) {
        super();
        this.widget = widget;
        this.length = length;
        this.side = side;
        this.open = open;
    }
    static create(widget, length, side, open = 0) {
        return new (widget.customView || WidgetView)(widget, length, side, open);
    }
    slice(from, to = this.length) { return WidgetView.create(this.widget, to - from, this.side); }
    sync() {
        if (!this.dom || !this.widget.updateDOM(this.dom)) {
            this.setDOM(this.widget.toDOM(this.editorView));
            this.dom.contentEditable = "false";
        }
    }
    getSide() { return this.side; }
    merge(from, to = this.length, source = null) {
        if (source) {
            if (!(source instanceof WidgetView) || !source.open ||
                from > 0 && !(source.open & 1 /* Start */) ||
                to < this.length && !(source.open & 2 /* End */))
                return false;
            if (!this.widget.compare(source.widget))
                throw new Error("Trying to merge incompatible widgets");
        }
        this.length = from + (source ? source.length : 0) + (this.length - to);
        return true;
    }
    match(other) {
        if (other.length == this.length && other instanceof WidgetView && other.side == this.side) {
            if (this.widget.constructor == other.widget.constructor) {
                if (!this.widget.eq(other.widget.value))
                    this.markDirty(true);
                this.widget = other.widget;
                return true;
            }
        }
        return false;
    }
    ignoreMutation() { return true; }
    ignoreEvent(event) { return this.widget.ignoreEvent(event); }
    get overrideDOMText() {
        if (this.length == 0)
            return Text.empty;
        let top = this;
        while (top.parent)
            top = top.parent;
        let view = top.editorView, text = view && view.state.doc, start = this.posAtStart;
        return text ? text.slice(start, start + this.length) : Text.empty;
    }
    domAtPos(pos) {
        return pos == 0 ? DOMPos.before(this.dom) : DOMPos.after(this.dom, pos == this.length);
    }
    domBoundsAround() { return null; }
    coordsAt(pos, _side) {
        let rects = this.dom.getClientRects(), rect = null;
        for (let i = pos > 0 ? rects.length - 1 : 0;; i += (pos > 0 ? -1 : 1)) {
            rect = rects[i];
            if (pos > 0 ? i == 0 : i == rects.length - 1 || rect.top < rect.bottom)
                break;
        }
        return rect;
    }
}
class CompositionView extends WidgetView {
    domAtPos(pos) { return new DOMPos(this.widget.value.text, pos); }
    sync() { if (!this.dom)
        this.setDOM(this.widget.toDOM(this.editorView)); }
    localPosFromDOM(node, offset) {
        return !offset ? 0 : node.nodeType == 3 ? Math.min(offset, this.length) : this.length;
    }
    ignoreMutation() { return false; }
    get overrideDOMText() { return null; }
    coordsAt(pos, side) { return textCoords(this.widget.value.text, pos, side, this.length); }
}

/// Widgets added to the content are described by subclasses of this
/// class. This makes it possible to delay creating of the DOM
/// structure for a widget until it is needed, and to avoid redrawing
/// widgets even when the decorations that define them are recreated.
/// `T` can be a type of value passed to instances of the widget type.
class WidgetType {
    /// Create an instance of this widget type.
    constructor(
    /// @internal
    value) {
        this.value = value;
    }
    /// Compare this instance to another instance of the same class. By
    /// default, it'll compare the instances' parameters with `===`.
    eq(value) { return this.value === value; }
    /// Update a DOM element created by a widget of the same type but
    /// with a different value to reflect this widget. May return true
    /// to indicate that it could update, false to indicate it couldn't
    /// (in which case the widget will be redrawn). The default
    /// implementation just returns false.
    updateDOM(_dom) { return false; }
    /// @internal
    compare(other) {
        return this == other || this.constructor == other.constructor && this.eq(other.value);
    }
    /// The estimated height this widget will have, to be used when
    /// estimating the height of content that hasn't been drawn. May
    /// return -1 to indicate you don't know. The default implementation
    /// returns -1.
    get estimatedHeight() { return -1; }
    /// Can be used to configure which kinds of events inside the widget
    /// should be ignored by the editor. The default is to ignore all
    /// events.
    ignoreEvent(_event) { return true; }
    //// @internal
    get customView() { return null; }
}
/// The different types of blocks that can occur in an editor view.
var BlockType;
(function (BlockType) {
    /// A line of text.
    BlockType[BlockType["Text"] = 0] = "Text";
    /// A block widget associated with the position after it.
    BlockType[BlockType["WidgetBefore"] = 1] = "WidgetBefore";
    /// A block widget associated with the position before it.
    BlockType[BlockType["WidgetAfter"] = 2] = "WidgetAfter";
    /// A block widget [replacing](#view.Decoration^replace) a range of content.
    BlockType[BlockType["WidgetRange"] = 3] = "WidgetRange";
})(BlockType || (BlockType = {}));
/// A decoration provides information on how to draw or style a piece
/// of content. You'll usually use it wrapped in a
/// [`Range`](#rangeset.Range), which adds a start and
/// end position.
class Decoration extends RangeValue {
    /// @internal
    constructor(
    /// @internal
    startSide, 
    /// @internal
    endSide, 
    /// @internal
    widget, 
    /// The config object used to create this decoration.
    spec) {
        super();
        this.startSide = startSide;
        this.endSide = endSide;
        this.widget = widget;
        this.spec = spec;
    }
    /// @internal
    get point() { return false; }
    /// @internal
    get heightRelevant() { return false; }
    /// Create a mark decoration, which influences the styling of the
    /// text in its range.
    static mark(spec) {
        return new MarkDecoration(spec);
    }
    /// Create a widget decoration, which adds an element at the given
    /// position.
    static widget(spec) {
        let side = spec.side || 0;
        if (spec.block)
            side += (200000000 /* BigBlock */ + 1) * (side > 0 ? 1 : -1);
        return new PointDecoration(spec, side, side, !!spec.block, spec.widget || null, false);
    }
    /// Create a replace decoration which replaces the given range with
    /// a widget, or simply hides it.
    static replace(spec) {
        let block = !!spec.block;
        let { start, end } = getInclusive(spec);
        let startSide = block ? -200000000 /* BigBlock */ * (start ? 2 : 1) : 100000000 /* BigInline */ * (start ? -1 : 1);
        let endSide = block ? 200000000 /* BigBlock */ * (end ? 2 : 1) : 100000000 /* BigInline */ * (end ? 1 : -1);
        return new PointDecoration(spec, startSide, endSide, block, spec.widget || null, true);
    }
    /// Create a line decoration, which can add DOM attributes to the
    /// line starting at the given position.
    static line(spec) {
        return new LineDecoration(spec);
    }
    /// Build a [`DecorationSet`](#view.DecorationSet) from the given
    /// decorated range or ranges.
    static set(of, sort = false) {
        return RangeSet.of(of, sort);
    }
    /// @internal
    hasHeight() { return this.widget ? this.widget.estimatedHeight > -1 : false; }
}
/// The empty set of decorations.
Decoration.none = RangeSet.empty;
class MarkDecoration extends Decoration {
    constructor(spec) {
        let { start, end } = getInclusive(spec);
        super(100000000 /* BigInline */ * (start ? -1 : 1), 100000000 /* BigInline */ * (end ? 1 : -1), null, spec);
    }
    eq(other) {
        return this == other ||
            other instanceof MarkDecoration &&
                this.spec.tagName == other.spec.tagName &&
                this.spec.class == other.spec.class &&
                attrsEq(this.spec.attributes || null, other.spec.attributes || null);
    }
    range(from, to = from) {
        if (from >= to)
            throw new RangeError("Mark decorations may not be empty");
        return super.range(from, to);
    }
}
class LineDecoration extends Decoration {
    constructor(spec) {
        super(-100000000 /* BigInline */, -100000000 /* BigInline */, null, spec);
    }
    get point() { return true; }
    eq(other) {
        return other instanceof LineDecoration && attrsEq(this.spec.attributes, other.spec.attributes);
    }
    range(from, to = from) {
        if (to != from)
            throw new RangeError("Line decoration ranges must be zero-length");
        return super.range(from, to);
    }
}
LineDecoration.prototype.mapMode = MapMode.TrackBefore;
class PointDecoration extends Decoration {
    constructor(spec, startSide, endSide, block, widget, isReplace) {
        super(startSide, endSide, widget, spec);
        this.block = block;
        this.isReplace = isReplace;
        this.mapMode = !block ? MapMode.TrackDel : startSide < 0 ? MapMode.TrackBefore : MapMode.TrackAfter;
    }
    get point() { return true; }
    // Only relevant when this.block == true
    get type() {
        return this.startSide < this.endSide ? BlockType.WidgetRange
            : this.startSide < 0 ? BlockType.WidgetBefore : BlockType.WidgetAfter;
    }
    get heightRelevant() { return this.block || !!this.widget && this.widget.estimatedHeight >= 5; }
    eq(other) {
        return other instanceof PointDecoration &&
            widgetsEq(this.widget, other.widget) &&
            this.block == other.block &&
            this.startSide == other.startSide && this.endSide == other.endSide;
    }
    range(from, to = from) {
        if (this.isReplace && (from > to || (from == to && this.startSide > 0 && this.endSide < 0)))
            throw new RangeError("Invalid range for replacement decoration");
        if (!this.isReplace && to != from)
            throw new RangeError("Widget decorations can only create zero-length ranges");
        return super.range(from, to);
    }
}
function getInclusive(spec) {
    let { inclusiveStart: start, inclusiveEnd: end } = spec;
    if (start == null)
        start = spec.inclusive;
    if (end == null)
        end = spec.inclusive;
    return { start: start || false, end: end || false };
}
function widgetsEq(a, b) {
    return a == b || !!(a && b && a.compare(b));
}
const MinRangeGap = 4;
function addRange(from, to, ranges) {
    let last = ranges.length - 1;
    if (last >= 0 && ranges[last] + MinRangeGap > from)
        ranges[last] = Math.max(ranges[last], to);
    else
        ranges.push(from, to);
}

const theme = Facet.define();
const darkTheme = Facet.define({ combine: values => values.indexOf(true) > -1 });
const baseThemeID = StyleModule.newName();
const baseLightThemeID = StyleModule.newName();
const baseDarkThemeID = StyleModule.newName();
function buildTheme(mainID, spec) {
    let styles = Object.create(null);
    for (let prop in spec) {
        let selector = prop.split(/\s*,\s*/).map(piece => {
            let id = mainID, narrow;
            if (id == baseThemeID && (narrow = /^(.*?)@(light|dark)$/.exec(piece))) {
                id = narrow[2] == "dark" ? baseDarkThemeID : baseLightThemeID;
                piece = narrow[1];
            }
            let parts = piece.split("."), selector = "." + id + (parts[0] == "wrap" ? "" : " ");
            for (let i = 1; i <= parts.length; i++)
                selector += ".cm-" + parts.slice(0, i).join("-");
            return selector;
        }).join(", ");
        styles[selector] = spec[prop];
    }
    return new StyleModule(styles, { generateClasses: false });
}
/// Create a set of CSS class names for the given theme selector,
/// which can be added to a DOM element within an editor to make
/// themes able to style it. Theme selectors can be single words or
/// words separated by dot characters. In the latter case, the
/// returned classes combine those that match the full name and those
/// that match some prefix—for example `"panel.search"` will match
/// both the theme styles specified as `"panel.search"` and those with
/// just `"panel"`. More specific theme styles (with more dots) take
/// precedence.
function themeClass(selector) {
    let parts = selector.split("."), result = "";
    for (let i = 1; i <= parts.length; i++)
        result += (result ? " " : "") + "cm-" + parts.slice(0, i).join("-");
    return result;
}
const baseTheme = buildTheme(baseThemeID, {
    wrap: {
        position: "relative !important",
        boxSizing: "border-box",
        "&.cm-focused": {
            // FIXME it would be great if we could directly use the browser's
            // default focus outline, but it appears we can't, so this tries to
            // approximate that
            outline_fallback: "1px dotted #212121",
            outline: "5px auto -webkit-focus-ring-color"
        },
        display: "flex !important",
        flexDirection: "column"
    },
    scroller: {
        display: "flex !important",
        alignItems: "flex-start !important",
        fontFamily: "monospace",
        lineHeight: 1.4,
        height: "100%",
        overflowX: "auto"
    },
    content: {
        margin: 0,
        flexGrow: 2,
        minHeight: "100%",
        display: "block",
        whiteSpace: "pre",
        boxSizing: "border-box",
        padding: "4px 0",
        outline: "none"
    },
    "content@light": { caretColor: "black" },
    "content@dark": { caretColor: "white" },
    line: {
        display: "block",
        padding: "0 2px 0 4px"
    }
});

const LineClass = themeClass("line");
class LineView extends ContentView {
    constructor() {
        super(...arguments);
        this.children = [];
        this.length = 0;
        this.prevAttrs = undefined;
        this.attrs = null;
        this.breakAfter = 0;
    }
    // Consumes source
    merge(from, to, source, takeDeco) {
        if (source) {
            if (!(source instanceof LineView))
                return false;
            if (!this.dom)
                source.transferDOM(this); // Reuse source.dom when appropriate
        }
        if (takeDeco)
            this.setDeco(source ? source.attrs : null);
        let elts = source ? source.children : [];
        let cur = this.childCursor();
        let { i: toI, off: toOff } = cur.findPos(to, 1);
        let { i: fromI, off: fromOff } = cur.findPos(from, -1);
        let dLen = from - to;
        for (let view of elts)
            dLen += view.length;
        this.length += dLen;
        // Both from and to point into the same text view
        if (fromI == toI && fromOff) {
            let start = this.children[fromI];
            // Maybe just update that view and be done
            if (elts.length == 1 && start.merge(fromOff, toOff, elts[0]))
                return true;
            if (elts.length == 0) {
                start.merge(fromOff, toOff, null);
                return true;
            }
            // Otherwise split it, so that we don't have to worry about aliasing front/end afterwards
            let after = start.slice(toOff);
            if (after.merge(0, 0, elts[elts.length - 1]))
                elts[elts.length - 1] = after;
            else
                elts.push(after);
            toI++;
            toOff = 0;
        }
        // Make sure start and end positions fall on node boundaries
        // (fromOff/toOff are no longer used after this), and that if the
        // start or end of the elts can be merged with adjacent nodes,
        // this is done
        if (toOff) {
            let end = this.children[toI];
            if (elts.length && end.merge(0, toOff, elts[elts.length - 1]))
                elts.pop();
            else
                end.merge(0, toOff, null);
        }
        else if (toI < this.children.length && elts.length &&
            this.children[toI].merge(0, 0, elts[elts.length - 1])) {
            elts.pop();
        }
        if (fromOff) {
            let start = this.children[fromI];
            if (elts.length && start.merge(fromOff, undefined, elts[0]))
                elts.shift();
            else
                start.merge(fromOff, undefined, null);
            fromI++;
        }
        else if (fromI && elts.length && this.children[fromI - 1].merge(this.children[fromI - 1].length, undefined, elts[0])) {
            elts.shift();
        }
        // Then try to merge any mergeable nodes at the start and end of
        // the changed range
        while (fromI < toI && elts.length && this.children[toI - 1].match(elts[elts.length - 1])) {
            elts.pop();
            toI--;
        }
        while (fromI < toI && elts.length && this.children[fromI].match(elts[0])) {
            elts.shift();
            fromI++;
        }
        // And if anything remains, splice the child array to insert the new elts
        if (elts.length || fromI != toI)
            this.replaceChildren(fromI, toI, elts);
        return true;
    }
    split(at) {
        let end = new LineView;
        end.breakAfter = this.breakAfter;
        if (this.length == 0)
            return end;
        let { i, off } = this.childPos(at);
        if (off) {
            end.append(this.children[i].slice(off));
            this.children[i].merge(off, undefined, null);
            i++;
        }
        for (let j = i; j < this.children.length; j++)
            end.append(this.children[j]);
        while (i > 0 && this.children[i - 1].length == 0) {
            this.children[i - 1].parent = null;
            i--;
        }
        this.children.length = i;
        this.markDirty();
        this.length = at;
        return end;
    }
    transferDOM(other) {
        if (!this.dom)
            return;
        other.setDOM(this.dom);
        other.prevAttrs = this.prevAttrs === undefined ? this.attrs : this.prevAttrs;
        this.prevAttrs = undefined;
        this.dom = null;
    }
    setDeco(attrs) {
        if (!attrsEq(this.attrs, attrs)) {
            if (this.dom) {
                this.prevAttrs = this.attrs;
                this.markDirty();
            }
            this.attrs = attrs;
        }
    }
    // Only called when building a line view in ContentBuilder
    append(child) {
        this.children.push(child);
        child.setParent(this);
        this.length += child.length;
    }
    // Only called when building a line view in ContentBuilder
    addLineDeco(deco) {
        let attrs = deco.spec.attributes;
        if (attrs)
            this.attrs = combineAttrs(attrs, this.attrs || {});
    }
    domAtPos(pos) {
        let i = 0;
        for (let off = 0; i < this.children.length; i++) {
            let child = this.children[i], end = off + child.length;
            if (end == off && child.getSide() <= 0)
                continue;
            if (pos > off && pos < end && child.dom.parentNode == this.dom)
                return child.domAtPos(pos - off);
            if (pos <= off)
                break;
            off = end;
        }
        for (; i > 0; i--) {
            let before = this.children[i - 1].dom;
            if (before.parentNode == this.dom)
                return DOMPos.after(before);
        }
        return new DOMPos(this.dom, 0);
    }
    // FIXME might need another hack to work around Firefox's behavior
    // of not actually displaying the cursor even though it's there in
    // the DOM
    sync() {
        if (!this.dom) {
            this.setDOM(document.createElement("div"));
            this.dom.className = LineClass;
            this.prevAttrs = this.attrs ? null : undefined;
        }
        if (this.prevAttrs !== undefined) {
            updateAttrs(this.dom, this.prevAttrs, this.attrs);
            this.dom.classList.add(LineClass);
            this.prevAttrs = undefined;
        }
        super.sync();
        let last = this.dom.lastChild;
        if (!last || (last.nodeName != "BR" && !(ContentView.get(last) instanceof TextView))) {
            let hack = document.createElement("BR");
            hack.cmIgnore = true;
            this.dom.appendChild(hack);
        }
    }
    measureTextSize() {
        if (this.children.length == 0 || this.length > 20)
            return null;
        let totalWidth = 0;
        for (let child of this.children) {
            if (!(child instanceof TextView))
                return null;
            let rects = clientRectsFor(child.dom);
            if (rects.length != 1)
                return null;
            totalWidth += rects[0].width;
        }
        return { lineHeight: this.dom.getBoundingClientRect().height,
            charWidth: totalWidth / this.length };
    }
    coordsAt(pos, side) {
        for (let off = 0, i = 0; i < this.children.length; i++) {
            let child = this.children[i], end = off + child.length;
            if (end != off && (side <= 0 || end == this.length ? end >= pos : end > pos))
                return child.coordsAt(pos - off, side);
            off = end;
        }
        return this.dom.lastChild.getBoundingClientRect();
    }
    match(_other) { return false; }
    get type() { return BlockType.Text; }
    static find(docView, pos) {
        for (let i = 0, off = 0;; i++) {
            let block = docView.children[i], end = off + block.length;
            if (end >= pos) {
                if (block instanceof LineView)
                    return block;
                if (block.length)
                    return null;
            }
            off = end + block.breakAfter;
        }
    }
}
const none$2$1 = [];
class BlockWidgetView extends ContentView {
    constructor(widget, length, type, 
    // This is set by the builder and used to distinguish between
    // adjacent widgets and parts of the same widget when calling
    // `merge`. It's kind of silly that it's an instance variable, but
    // it's hard to route there otherwise.
    open = 0) {
        super();
        this.widget = widget;
        this.length = length;
        this.type = type;
        this.open = open;
        this.breakAfter = 0;
    }
    merge(from, to, source) {
        if (!(source instanceof BlockWidgetView) || !source.open ||
            from > 0 && !(source.open & 1 /* Start */) ||
            to < this.length && !(source.open & 2 /* End */))
            return false;
        if (!this.widget.compare(source.widget))
            throw new Error("Trying to merge an open widget with an incompatible node");
        this.length = from + source.length + (this.length - to);
        return true;
    }
    domAtPos(pos) {
        return pos == 0 ? DOMPos.before(this.dom) : DOMPos.after(this.dom, pos == this.length);
    }
    split(at) {
        let len = this.length - at;
        this.length = at;
        return new BlockWidgetView(this.widget, len, this.type);
    }
    get children() { return none$2$1; }
    sync() {
        if (!this.dom || !this.widget.updateDOM(this.dom)) {
            this.setDOM(this.widget.toDOM(this.editorView));
            this.dom.contentEditable = "false";
        }
    }
    get overrideDOMText() {
        return this.parent ? this.parent.view.state.doc.slice(this.posAtStart, this.posAtEnd) : Text.empty;
    }
    domBoundsAround() { return null; }
    match(other) {
        if (other instanceof BlockWidgetView && other.type == this.type &&
            other.widget.constructor == this.widget.constructor) {
            if (!other.widget.eq(this.widget.value))
                this.markDirty(true);
            this.widget = other.widget;
            this.length = other.length;
            this.breakAfter = other.breakAfter;
            return true;
        }
        return false;
    }
}

class ContentBuilder {
    constructor(doc, pos, end) {
        this.doc = doc;
        this.pos = pos;
        this.end = end;
        this.content = [];
        this.curLine = null;
        this.breakAtStart = 0;
        this.text = "";
        this.textOff = 0;
        this.cursor = doc.iter();
        this.skip = pos;
    }
    posCovered() {
        if (this.content.length == 0)
            return !this.breakAtStart && this.doc.lineAt(this.pos).start != this.pos;
        let last = this.content[this.content.length - 1];
        return !last.breakAfter && !(last instanceof BlockWidgetView && last.type == BlockType.WidgetBefore);
    }
    getLine() {
        if (!this.curLine)
            this.content.push(this.curLine = new LineView);
        return this.curLine;
    }
    addWidget(view) {
        this.curLine = null;
        this.content.push(view);
    }
    finish() {
        if (!this.posCovered())
            this.getLine();
    }
    buildText(length, tagName, clss, attrs, _ranges) {
        while (length > 0) {
            if (this.textOff == this.text.length) {
                let { value, lineBreak, done } = this.cursor.next(this.skip);
                this.skip = 0;
                if (done)
                    throw new Error("Ran out of text content when drawing inline views");
                if (lineBreak) {
                    if (!this.posCovered())
                        this.getLine();
                    if (this.content.length)
                        this.content[this.content.length - 1].breakAfter = 1;
                    else
                        this.breakAtStart = 1;
                    this.curLine = null;
                    length--;
                    continue;
                }
                else {
                    this.text = value;
                    this.textOff = 0;
                }
            }
            let take = Math.min(this.text.length - this.textOff, length);
            this.getLine().append(new TextView(this.text.slice(this.textOff, this.textOff + take), tagName, clss, attrs));
            length -= take;
            this.textOff += take;
        }
    }
    span(from, to, active) {
        let tagName = null, clss = null;
        let attrs = null;
        for (let { spec } of active) {
            if (spec.tagName)
                tagName = spec.tagName;
            if (spec.class)
                clss = clss ? clss + " " + spec.class : spec.class;
            if (spec.attributes)
                for (let name in spec.attributes) {
                    let value = spec.attributes[name];
                    if (value == null)
                        continue;
                    if (name == "class") {
                        clss = clss ? clss + " " + value : value;
                    }
                    else {
                        if (!attrs)
                            attrs = {};
                        if (name == "style" && attrs.style)
                            value = attrs.style + ";" + value;
                        attrs[name] = value;
                    }
                }
        }
        this.buildText(to - from, tagName, clss, attrs, active);
        this.pos = to;
    }
    point(from, to, deco, openStart, openEnd) {
        let open = (openStart ? 1 /* Start */ : 0) | (openEnd ? 2 /* End */ : 0);
        let len = to - from;
        if (deco instanceof PointDecoration) {
            if (deco.block) {
                let { type } = deco;
                if (type == BlockType.WidgetAfter && !this.posCovered())
                    this.getLine();
                this.addWidget(new BlockWidgetView(deco.widget || new NullWidget("div"), len, type, open));
            }
            else {
                this.getLine().append(WidgetView.create(deco.widget || new NullWidget("span"), len, deco.startSide, open));
            }
        }
        else if (this.doc.lineAt(this.pos).start == this.pos) { // Line decoration
            this.getLine().addLineDeco(deco);
        }
        if (len) {
            // Advance the iterator past the replaced content
            if (this.textOff + len <= this.text.length) {
                this.textOff += len;
            }
            else {
                this.skip += len - (this.text.length - this.textOff);
                this.text = "";
                this.textOff = 0;
            }
            this.pos = to;
        }
    }
    static build(text, from, to, decorations) {
        let builder = new ContentBuilder(text, from, to);
        RangeSet.spans(decorations, from, to, builder);
        builder.finish();
        return builder;
    }
}
class NullWidget extends WidgetType {
    toDOM() { return document.createElement(this.value); }
    updateDOM(elt) { return elt.nodeName.toLowerCase() == this.value; }
}

/// Used to indicate [text direction](#view.EditorView.textDirection).
var Direction;
(function (Direction) {
    // (These are chosen to match the base levels, in bidi algorithm
    // terms, of spans in that direction.)
    Direction[Direction["LTR"] = 0] = "LTR";
    Direction[Direction["RTL"] = 1] = "RTL";
})(Direction || (Direction = {}));
const LTR = Direction.LTR, RTL = Direction.RTL;
// Decode a string with each type encoded as log2(type)
function dec(str) {
    let result = [];
    for (let i = 0; i < str.length; i++)
        result.push(1 << +str[i]);
    return result;
}
// Character types for codepoints 0 to 0xf8
const LowTypes = dec("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008");
// Character types for codepoints 0x600 to 0x6f9
const ArabicTypes = dec("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333");
function charType(ch) {
    return ch <= 0xf7 ? LowTypes[ch] :
        0x590 <= ch && ch <= 0x5f4 ? 2 /* R */ :
            0x600 <= ch && ch <= 0x6f9 ? ArabicTypes[ch - 0x600] :
                0x6ee <= ch && ch <= 0x8ac ? 4 /* AL */ :
                    0x2000 <= ch && ch <= 0x200b ? 256 /* NI */ :
                        ch == 0x200c ? 256 /* NI */ : 1 /* L */;
}
const BidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
class BidiSpan {
    constructor(from, to, level) {
        this.from = from;
        this.to = to;
        this.level = level;
    }
    get dir() { return this.level % 2 ? RTL : LTR; }
    side(end, dir) { return (this.dir == dir) == end ? this.to : this.from; }
    static find(order, index, level, assoc) {
        let maybe = -1;
        for (let i = 0; i < order.length; i++) {
            let span = order[i];
            if (span.from <= index && span.to >= index) {
                if (span.level == level)
                    return i;
                // When multiple spans match, if assoc != 0, take the one that
                // covers that side, otherwise take the one with the minimum
                // level.
                if (maybe < 0 || (assoc != 0 ? (assoc < 0 ? span.from < index : span.to > index) : order[maybe].level > span.level))
                    maybe = i;
            }
        }
        if (maybe < 0)
            throw new RangeError("Index out of range");
        return maybe;
    }
}
// Reused array of character types
const types = [];
function computeOrder(line, direction) {
    let len = line.length, outerType = direction == LTR ? 1 /* L */ : 2 /* R */;
    if (!line || outerType == 1 /* L */ && !BidiRE.test(line))
        return trivialOrder(len);
    // W1. Examine each non-spacing mark (NSM) in the level run, and
    // change the type of the NSM to the type of the previous
    // character. If the NSM is at the start of the level run, it will
    // get the type of sor.
    // W2. Search backwards from each instance of a European number
    // until the first strong type (R, L, AL, or sor) is found. If an
    // AL is found, change the type of the European number to Arabic
    // number.
    // W3. Change all ALs to R.
    // (Left after this: L, R, EN, AN, ET, CS, NI)
    for (let i = 0, prev = outerType, prevStrong = outerType; i < len; i++) {
        let type = charType(line.charCodeAt(i));
        if (type == 512 /* NSM */)
            type = prev;
        else if (type == 8 /* EN */ && prevStrong == 4 /* AL */)
            type = 16 /* AN */;
        types[i] = type == 4 /* AL */ ? 2 /* R */ : type;
        if (type & 7 /* Strong */)
            prevStrong = type;
        prev = type;
    }
    // W5. A sequence of European terminators adjacent to European
    // numbers changes to all European numbers.
    // W6. Otherwise, separators and terminators change to Other
    // Neutral.
    // W7. Search backwards from each instance of a European number
    // until the first strong type (R, L, or sor) is found. If an L is
    // found, then change the type of the European number to L.
    // (Left after this: L, R, EN+AN, NI)
    for (let i = 0, prev = outerType, prevStrong = outerType; i < len; i++) {
        let type = types[i];
        if (type == 128 /* CS */) {
            if (i < len - 1 && prev == types[i + 1] && (prev & 24 /* Num */))
                type = types[i] = prev;
            else
                types[i] = 256 /* NI */;
        }
        else if (type == 64 /* ET */) {
            let end = i + 1;
            while (end < len && types[end] == 64 /* ET */)
                end++;
            let replace = (i && prev == 8 /* EN */) || (end < len && types[end] == 8 /* EN */) ? (prevStrong == 1 /* L */ ? 1 /* L */ : 8 /* EN */) : 256 /* NI */;
            for (let j = i; j < end; j++)
                types[j] = replace;
            i = end - 1;
        }
        else if (type == 8 /* EN */ && prevStrong == 1 /* L */) {
            types[i] = 1 /* L */;
        }
        prev = type;
        if (type & 7 /* Strong */)
            prevStrong = type;
    }
    // N1. A sequence of neutrals takes the direction of the
    // surrounding strong text if the text on both sides has the same
    // direction. European and Arabic numbers act as if they were R in
    // terms of their influence on neutrals. Start-of-level-run (sor)
    // and end-of-level-run (eor) are used at level run boundaries.
    // N2. Any remaining neutrals take the embedding direction.
    // (Left after this: L, R, EN+AN)
    for (let i = 0; i < len; i++) {
        if (types[i] == 256 /* NI */) {
            let end = i + 1;
            while (end < len && types[end] == 256 /* NI */)
                end++;
            let beforeL = (i ? types[i - 1] : outerType) == 1 /* L */;
            let afterL = (end < len ? types[end] : outerType) == 1 /* L */;
            let replace = beforeL == afterL ? (beforeL ? 1 /* L */ : 2 /* R */) : outerType;
            for (let j = i; j < end; j++)
                types[j] = replace;
            i = end - 1;
        }
    }
    // Here we depart from the documented algorithm, in order to avoid
    // building up an actual levels array. Since there are only three
    // levels (0, 1, 2) in an implementation that doesn't take
    // explicit embedding into account, we can build up the order on
    // the fly, without following the level-based algorithm.
    let order = [];
    if (outerType == 1 /* L */) {
        for (let i = 0; i < len;) {
            let start = i, rtl = types[i++] != 1 /* L */;
            while (i < len && rtl == (types[i] != 1 /* L */))
                i++;
            if (rtl) {
                for (let j = i; j > start;) {
                    let end = j, l = types[--j] != 2 /* R */;
                    while (j > start && l == (types[j - 1] != 2 /* R */))
                        j--;
                    order.push(new BidiSpan(j, end, l ? 2 : 1));
                }
            }
            else {
                order.push(new BidiSpan(start, i, 0));
            }
        }
    }
    else {
        for (let i = 0; i < len;) {
            let start = i, rtl = types[i++] == 2 /* R */;
            while (i < len && rtl == (types[i] == 2 /* R */))
                i++;
            order.push(new BidiSpan(start, i, rtl ? 1 : 2));
        }
    }
    return order;
}
function trivialOrder(length) {
    return [new BidiSpan(0, length, 0)];
}
let movedOver = "";
function moveVisually(line, order, dir, start, forward) {
    var _a;
    let startIndex = start.head - line.start, spanI = -1;
    if (startIndex == 0) {
        if (!forward || !line.length)
            return null;
        if (order[0].level != dir) {
            startIndex = order[0].side(false, dir);
            spanI = 0;
        }
    }
    else if (startIndex == line.length) {
        if (forward)
            return null;
        let last = order[order.length - 1];
        if (last.level != dir) {
            startIndex = last.side(true, dir);
            spanI = order.length - 1;
        }
    }
    if (spanI < 0)
        spanI = BidiSpan.find(order, startIndex, (_a = start.bidiLevel) !== null && _a !== void 0 ? _a : -1, start.assoc);
    let span = order[spanI];
    // End of span. (But not end of line--that was checked for above.)
    if (startIndex == span.side(forward, dir)) {
        span = order[spanI += forward ? 1 : -1];
        startIndex = span.side(!forward, dir);
    }
    let indexForward = forward == (span.dir == dir);
    let nextIndex = line.findClusterBreak(startIndex, indexForward);
    movedOver = line.slice(Math.min(startIndex, nextIndex), Math.max(startIndex, nextIndex));
    if (nextIndex != span.side(forward, dir))
        return EditorSelection.cursor(nextIndex + line.start, indexForward ? -1 : 1, span.level);
    let nextSpan = spanI == (forward ? order.length - 1 : 0) ? null : order[spanI + (forward ? 1 : -1)];
    if (!nextSpan && span.level != dir)
        return EditorSelection.cursor(forward ? line.end : line.start, forward ? -1 : 1, dir);
    if (nextSpan && nextSpan.level < span.level)
        return EditorSelection.cursor(nextSpan.side(!forward, dir) + line.start, 0, nextSpan.level);
    return EditorSelection.cursor(nextIndex + line.start, 0, span.level);
}

const wrappingWhiteSpace = ["pre-wrap", "normal", "pre-line"];
class HeightOracle {
    constructor() {
        this.doc = Text.empty;
        this.lineWrapping = false;
        this.direction = Direction.LTR;
        this.heightSamples = {};
        this.lineHeight = 14;
        this.charWidth = 7;
        this.lineLength = 30;
        // Used to track, during updateHeight, if any actual heights changed
        this.heightChanged = false;
    }
    heightForGap(from, to) {
        let lines = this.doc.lineAt(to).number - this.doc.lineAt(from).number + 1;
        if (this.lineWrapping)
            lines += Math.ceil(((to - from) - (lines * this.lineLength * 0.5)) / this.lineLength);
        return this.lineHeight * lines;
    }
    heightForLine(length) {
        if (!this.lineWrapping)
            return this.lineHeight;
        let lines = 1 + Math.max(0, Math.ceil((length - this.lineLength) / (this.lineLength - 5)));
        return lines * this.lineHeight;
    }
    setDoc(doc) { this.doc = doc; return this; }
    mustRefresh(lineHeights, whiteSpace, direction) {
        let newHeight = false;
        for (let i = 0; i < lineHeights.length; i++) {
            let h = lineHeights[i];
            if (h < 0) {
                i++;
            }
            else if (!this.heightSamples[Math.floor(h * 10)]) { // Round to .1 pixels
                newHeight = true;
                this.heightSamples[Math.floor(h * 10)] = true;
            }
        }
        return newHeight || (wrappingWhiteSpace.indexOf(whiteSpace) > -1) != this.lineWrapping || this.direction != direction;
    }
    refresh(whiteSpace, direction, lineHeight, charWidth, lineLength, knownHeights) {
        let lineWrapping = wrappingWhiteSpace.indexOf(whiteSpace) > -1;
        let changed = Math.round(lineHeight) != Math.round(this.lineHeight) ||
            this.lineWrapping != lineWrapping ||
            this.direction != direction;
        this.lineWrapping = lineWrapping;
        this.direction = direction;
        this.lineHeight = lineHeight;
        this.charWidth = charWidth;
        this.lineLength = lineLength;
        if (changed) {
            this.heightSamples = {};
            for (let i = 0; i < knownHeights.length; i++) {
                let h = knownHeights[i];
                if (h < 0)
                    i++;
                else
                    this.heightSamples[Math.floor(h * 10)] = true;
            }
        }
        return changed;
    }
}
// This object is used by `updateHeight` to make DOM measurements
// arrive at the right nides. The `heights` array is a sequence of
// block heights, starting from position `from`.
class MeasuredHeights {
    constructor(from, heights) {
        this.from = from;
        this.heights = heights;
        this.index = 0;
    }
    get more() { return this.index < this.heights.length; }
}
/// Record used to represent information about a block-level element
/// in the editor view.
class BlockInfo {
    /// @internal
    constructor(
    /// The start of the element in the document.
    from, 
    /// The length of the element.
    length, 
    /// The top position of the element.
    top, 
    /// Its height.
    height, 
    /// The type of element this is. When querying lines, this may be
    /// an array of all the blocks that make up the line.
    type) {
        this.from = from;
        this.length = length;
        this.top = top;
        this.height = height;
        this.type = type;
    }
    /// The end of the element as a document position.
    get to() { return this.from + this.length; }
    /// The bottom position of the element.
    get bottom() { return this.top + this.height; }
    /// @internal
    join(other) {
        let detail = (Array.isArray(this.type) ? this.type : [this])
            .concat(Array.isArray(other.type) ? other.type : [other]);
        return new BlockInfo(this.from, this.length + other.length, this.top, this.height + other.height, detail);
    }
}
var QueryType;
(function (QueryType) {
    QueryType[QueryType["ByPos"] = 0] = "ByPos";
    QueryType[QueryType["ByHeight"] = 1] = "ByHeight";
    QueryType[QueryType["ByPosNoHeight"] = 2] = "ByPosNoHeight";
})(QueryType || (QueryType = {}));
const Epsilon = 1e-10;
class HeightMap {
    constructor(length, // The number of characters covered
    height, // Height of this part of the document
    flags = 2 /* Outdated */) {
        this.length = length;
        this.height = height;
        this.flags = flags;
    }
    get outdated() { return (this.flags & 2 /* Outdated */) > 0; }
    set outdated(value) { this.flags = (value ? 2 /* Outdated */ : 0) | (this.flags & ~2 /* Outdated */); }
    setHeight(oracle, height) {
        if (this.height != height) {
            if (Math.abs(this.height - height) > Epsilon)
                oracle.heightChanged = true;
            this.height = height;
        }
    }
    // Base case is to replace a leaf node, which simply builds a tree
    // from the new nodes and returns that (HeightMapBranch and
    // HeightMapGap override this to actually use from/to)
    replace(_from, _to, nodes, _doc) {
        return HeightMap.of(nodes);
    }
    // Again, these are base cases, and are overridden for branch and gap nodes.
    decomposeLeft(_to, result) { result.push(this); }
    decomposeRight(_from, result) { result.push(this); }
    applyChanges(decorations, oldDoc, oracle, changes) {
        let me = this;
        for (let i = changes.length - 1; i >= 0; i--) {
            let { fromA, toA, fromB, toB } = changes[i];
            let start = me.lineAt(fromA, QueryType.ByPosNoHeight, oldDoc, 0, 0);
            let end = start.to >= toA ? start : me.lineAt(toA, QueryType.ByPosNoHeight, oldDoc, 0, 0);
            toB += end.to - toA;
            toA = end.to;
            while (i > 0 && start.from <= changes[i - 1].toA) {
                fromA = changes[i - 1].fromA;
                fromB = changes[i - 1].fromB;
                i--;
                if (fromA < start.from)
                    start = me.lineAt(fromA, QueryType.ByPosNoHeight, oldDoc, 0, 0);
            }
            fromB += start.from - fromA;
            fromA = start.from;
            let nodes = NodeBuilder.build(oracle, decorations, fromB, toB);
            me = me.replace(fromA, toA, nodes, oracle.doc);
        }
        return me.updateHeight(oracle, 0);
    }
    static empty() { return new HeightMapText(0, 0); }
    // nodes uses null values to indicate the position of line breaks.
    // There are never line breaks at the start or end of the array, or
    // two line breaks next to each other, and the array isn't allowed
    // to be empty (same restrictions as return value from the builder).
    static of(nodes) {
        if (nodes.length == 1)
            return nodes[0];
        let i = 0, j = nodes.length, before = 0, after = 0;
        for (;;) {
            if (i == j) {
                if (before > after * 2) {
                    let split = nodes[i - 1];
                    if (split.break)
                        nodes.splice(--i, 1, split.left, null, split.right);
                    else
                        nodes.splice(--i, 1, split.left, split.right);
                    j += 1 + split.break;
                    before -= split.size;
                }
                else if (after > before * 2) {
                    let split = nodes[j];
                    if (split.break)
                        nodes.splice(j, 1, split.left, null, split.right);
                    else
                        nodes.splice(j, 1, split.left, split.right);
                    j += 2 + split.break;
                    after -= split.size;
                }
                else {
                    break;
                }
            }
            else if (before < after) {
                let next = nodes[i++];
                if (next)
                    before += next.size;
            }
            else {
                let next = nodes[--j];
                if (next)
                    after += next.size;
            }
        }
        let brk = 0;
        if (nodes[i - 1] == null) {
            brk = 1;
            i--;
        }
        else if (nodes[i] == null) {
            brk = 1;
            j++;
        }
        return new HeightMapBranch(HeightMap.of(nodes.slice(0, i)), brk, HeightMap.of(nodes.slice(j)));
    }
}
HeightMap.prototype.size = 1;
class HeightMapBlock extends HeightMap {
    constructor(length, height, type) {
        super(length, height);
        this.type = type;
    }
    blockAt(_height, _doc, top, offset) {
        return new BlockInfo(offset, this.length, top, this.height, this.type);
    }
    lineAt(_value, _type, doc, top, offset) {
        return this.blockAt(0, doc, top, offset);
    }
    forEachLine(_from, _to, doc, top, offset, f) {
        f(this.blockAt(0, doc, top, offset));
    }
    updateHeight(oracle, offset = 0, _force = false, measured) {
        if (measured && measured.from <= offset && measured.more)
            this.setHeight(oracle, measured.heights[measured.index++]);
        this.outdated = false;
        return this;
    }
    toString() { return `block(${this.length})`; }
}
class HeightMapText extends HeightMapBlock {
    constructor(length, height) {
        super(length, height, BlockType.Text);
        this.collapsed = 0; // Amount of collapsed content in the line
        this.widgetHeight = 0; // Maximum inline widget height
    }
    replace(from, _to, nodes, doc) {
        if (nodes.length == 1 && Math.abs(this.length - nodes[0].length) < 10 &&
            (nodes[0] instanceof HeightMapText || nodes[0] instanceof HeightMapGap && doc.lineAt(from).length == nodes[0].length)) {
            let node = nodes[0];
            if (node instanceof HeightMapGap)
                node = new HeightMapText(node.length, this.height);
            else
                node.height = this.height;
            return node;
        }
        else {
            return HeightMap.of(nodes);
        }
    }
    updateHeight(oracle, offset = 0, force = false, measured) {
        if (measured && measured.from <= offset && measured.more)
            this.setHeight(oracle, measured.heights[measured.index++]);
        else if (force || this.outdated)
            this.setHeight(oracle, Math.max(this.widgetHeight, oracle.heightForLine(this.length - this.collapsed)));
        this.outdated = false;
        return this;
    }
    toString() {
        return `line(${this.length}${this.collapsed ? -this.collapsed : ""}${this.widgetHeight ? ":" + this.widgetHeight : ""})`;
    }
}
class HeightMapGap extends HeightMap {
    constructor(length) { super(length, 0); }
    lines(doc, offset) {
        let firstLine = doc.lineAt(offset).number, lastLine = doc.lineAt(offset + this.length).number;
        return { firstLine, lastLine, lineHeight: this.height / (lastLine - firstLine + 1) };
    }
    blockAt(height, doc, top, offset) {
        let { firstLine, lastLine, lineHeight } = this.lines(doc, offset);
        let line = Math.max(0, Math.min(lastLine - firstLine, Math.floor((height - top) / lineHeight)));
        let { start, length } = doc.line(firstLine + line);
        return new BlockInfo(start, length, top + lineHeight * line, lineHeight, BlockType.Text);
    }
    lineAt(value, type, doc, top, offset) {
        if (type == QueryType.ByHeight)
            return this.blockAt(value, doc, top, offset);
        if (type == QueryType.ByPosNoHeight) {
            let { start, end } = doc.lineAt(value);
            return new BlockInfo(start, end - start, 0, 0, BlockType.Text);
        }
        let { firstLine, lineHeight } = this.lines(doc, offset);
        let { start, length, number } = doc.lineAt(value);
        return new BlockInfo(start, length, top + lineHeight * (number - firstLine), lineHeight, BlockType.Text);
    }
    forEachLine(from, to, doc, top, offset, f) {
        let { firstLine, lastLine, lineHeight } = this.lines(doc, offset);
        for (let line = firstLine; line <= lastLine; line++) {
            let { start, end } = doc.line(line);
            if (start > to)
                break;
            if (end >= from)
                f(new BlockInfo(start, end - start, top, top += lineHeight, BlockType.Text));
        }
    }
    replace(from, to, nodes) {
        let after = this.length - to;
        if (after > 0) {
            let last = nodes[nodes.length - 1];
            if (last instanceof HeightMapGap)
                nodes[nodes.length - 1] = new HeightMapGap(last.length + after);
            else
                nodes.push(null, new HeightMapGap(after - 1));
        }
        if (from > 0) {
            let first = nodes[0];
            if (first instanceof HeightMapGap)
                nodes[0] = new HeightMapGap(from + first.length);
            else
                nodes.unshift(new HeightMapGap(from - 1), null);
        }
        return HeightMap.of(nodes);
    }
    decomposeLeft(to, result) {
        result.push(new HeightMapGap(to - 1), null);
    }
    decomposeRight(from, result) {
        result.push(null, new HeightMapGap(this.length - from - 1));
    }
    updateHeight(oracle, offset = 0, force = false, measured) {
        let end = offset + this.length;
        if (measured && measured.from <= offset + this.length && measured.more) {
            // Fill in part of this gap with measured lines. We know there
            // can't be widgets or collapsed ranges in those lines, because
            // they would already have been added to the heightmap (gaps
            // only contain plain text).
            let nodes = [], pos = Math.max(offset, measured.from);
            if (measured.from > offset)
                nodes.push(new HeightMapGap(measured.from - offset - 1).updateHeight(oracle, offset));
            while (pos <= end && measured.more) {
                let len = oracle.doc.lineAt(pos).length;
                if (nodes.length)
                    nodes.push(null);
                let line = new HeightMapText(len, measured.heights[measured.index++]);
                line.outdated = false;
                nodes.push(line);
                pos += len + 1;
            }
            if (pos <= end)
                nodes.push(null, new HeightMapGap(end - pos).updateHeight(oracle, pos));
            oracle.heightChanged = true;
            return HeightMap.of(nodes);
        }
        else if (force || this.outdated) {
            this.setHeight(oracle, oracle.heightForGap(offset, offset + this.length));
            this.outdated = false;
        }
        return this;
    }
    toString() { return `gap(${this.length})`; }
}
class HeightMapBranch extends HeightMap {
    constructor(left, brk, right) {
        super(left.length + brk + right.length, left.height + right.height, brk | (left.outdated || right.outdated ? 2 /* Outdated */ : 0));
        this.left = left;
        this.right = right;
        this.size = left.size + right.size;
    }
    get break() { return this.flags & 1 /* Break */; }
    blockAt(height, doc, top, offset) {
        let mid = top + this.left.height;
        return height < mid || this.right.height == 0 ? this.left.blockAt(height, doc, top, offset)
            : this.right.blockAt(height, doc, mid, offset + this.left.length + this.break);
    }
    lineAt(value, type, doc, top, offset) {
        let rightTop = top + this.left.height, rightOffset = offset + this.left.length + this.break;
        let left = type == QueryType.ByHeight ? value < rightTop || this.right.height == 0 : value < rightOffset;
        let base = left ? this.left.lineAt(value, type, doc, top, offset)
            : this.right.lineAt(value, type, doc, rightTop, rightOffset);
        if (this.break || (left ? base.to < rightOffset : base.from > rightOffset))
            return base;
        let subQuery = type == QueryType.ByPosNoHeight ? QueryType.ByPosNoHeight : QueryType.ByPos;
        if (left)
            return base.join(this.right.lineAt(rightOffset, subQuery, doc, rightTop, rightOffset));
        else
            return this.left.lineAt(rightOffset, subQuery, doc, top, offset).join(base);
    }
    forEachLine(from, to, doc, top, offset, f) {
        let rightTop = top + this.left.height, rightOffset = offset + this.left.length + this.break;
        if (this.break) {
            if (from < rightOffset)
                this.left.forEachLine(from, to, doc, top, offset, f);
            if (to >= rightOffset)
                this.right.forEachLine(from, to, doc, rightTop, rightOffset, f);
        }
        else {
            let mid = this.lineAt(rightOffset, QueryType.ByPos, doc, top, offset);
            if (from < mid.from)
                this.left.forEachLine(from, mid.from - 1, doc, top, offset, f);
            if (mid.to >= from && mid.from <= to)
                f(mid);
            if (to > mid.to)
                this.right.forEachLine(mid.to + 1, to, doc, rightTop, rightOffset, f);
        }
    }
    replace(from, to, nodes, doc) {
        let rightStart = this.left.length + this.break;
        if (to < rightStart)
            return this.balanced(this.left.replace(from, to, nodes, doc), this.right);
        if (from > this.left.length)
            return this.balanced(this.left, this.right.replace(from - rightStart, to - rightStart, nodes, doc));
        let result = [];
        if (from > 0)
            this.decomposeLeft(from, result);
        let left = result.length;
        for (let node of nodes)
            result.push(node);
        if (from > 0)
            mergeGaps(result, left - 1);
        if (to < this.length) {
            let right = result.length;
            this.decomposeRight(to, result);
            mergeGaps(result, right);
        }
        return HeightMap.of(result);
    }
    decomposeLeft(to, result) {
        let left = this.left.length;
        if (to <= left)
            return this.left.decomposeLeft(to, result);
        result.push(this.left);
        if (this.break) {
            left++;
            if (to >= left)
                result.push(null);
        }
        if (to > left)
            this.right.decomposeLeft(to - left, result);
    }
    decomposeRight(from, result) {
        let left = this.left.length, right = left + this.break;
        if (from >= right)
            return this.right.decomposeRight(from - right, result);
        if (from < left)
            this.left.decomposeRight(from, result);
        if (this.break && from < right)
            result.push(null);
        result.push(this.right);
    }
    balanced(left, right) {
        if (left.size > 2 * right.size || right.size > 2 * left.size)
            return HeightMap.of(this.break ? [left, null, right] : [left, right]);
        this.left = left;
        this.right = right;
        this.height = left.height + right.height;
        this.outdated = left.outdated || right.outdated;
        this.size = left.size + right.size;
        this.length = left.length + this.break + right.length;
        return this;
    }
    updateHeight(oracle, offset = 0, force = false, measured) {
        let { left, right } = this, rightStart = offset + left.length + this.break, rebalance = null;
        if (measured && measured.from <= offset + left.length && measured.more)
            rebalance = left = left.updateHeight(oracle, offset, force, measured);
        else
            left.updateHeight(oracle, offset, force);
        if (measured && measured.from <= rightStart + right.length && measured.more)
            rebalance = right = right.updateHeight(oracle, rightStart, force, measured);
        else
            right.updateHeight(oracle, rightStart, force);
        if (rebalance)
            return this.balanced(left, right);
        this.height = this.left.height + this.right.height;
        this.outdated = false;
        return this;
    }
    toString() { return this.left + (this.break ? " " : "-") + this.right; }
}
function mergeGaps(nodes, around) {
    let before, after;
    if (nodes[around] == null &&
        (before = nodes[around - 1]) instanceof HeightMapGap &&
        (after = nodes[around + 1]) instanceof HeightMapGap)
        nodes.splice(around - 1, 3, new HeightMapGap(before.length + 1 + after.length));
}
const relevantWidgetHeight = 5;
class NodeBuilder {
    constructor(pos, oracle) {
        this.pos = pos;
        this.oracle = oracle;
        this.nodes = [];
        this.lineStart = -1;
        this.lineEnd = -1;
        this.covering = null;
        this.writtenTo = pos;
    }
    get isCovered() {
        return this.covering && this.nodes[this.nodes.length - 1] == this.covering;
    }
    span(_from, to) {
        if (this.lineStart > -1) {
            let end = Math.min(to, this.lineEnd), last = this.nodes[this.nodes.length - 1];
            if (last instanceof HeightMapText)
                last.length += end - this.pos;
            else if (end > this.pos || !this.isCovered)
                this.nodes.push(new HeightMapText(end - this.pos, -1));
            this.writtenTo = end;
            if (to > end) {
                this.nodes.push(null);
                this.writtenTo++;
                this.lineStart = -1;
            }
        }
        this.pos = to;
    }
    point(from, to, deco) {
        if (from < to || deco.heightRelevant) {
            let height = deco.widget ? Math.max(0, deco.widget.estimatedHeight) : 0;
            let len = to - from;
            if (deco.block) {
                this.addBlock(new HeightMapBlock(len, height, deco.type));
            }
            else if (len || height >= relevantWidgetHeight) {
                this.addLineDeco(height, len);
            }
        }
        else if (to > from) {
            this.span(from, to);
        }
        if (this.lineEnd > -1 && this.lineEnd < this.pos)
            this.lineEnd = this.oracle.doc.lineAt(this.pos).end;
    }
    enterLine() {
        if (this.lineStart > -1)
            return;
        let { start, end } = this.oracle.doc.lineAt(this.pos);
        this.lineStart = start;
        this.lineEnd = end;
        if (this.writtenTo < start) {
            if (this.writtenTo < start - 1 || this.nodes[this.nodes.length - 1] == null)
                this.nodes.push(new HeightMapGap(start - this.writtenTo - 1));
            this.nodes.push(null);
        }
        if (this.pos > start)
            this.nodes.push(new HeightMapText(this.pos - start, -1));
        this.writtenTo = this.pos;
    }
    ensureLine() {
        this.enterLine();
        let last = this.nodes.length ? this.nodes[this.nodes.length - 1] : null;
        if (last instanceof HeightMapText)
            return last;
        let line = new HeightMapText(0, -1);
        this.nodes.push(line);
        return line;
    }
    addBlock(block) {
        this.enterLine();
        if (block.type == BlockType.WidgetAfter && !this.isCovered)
            this.ensureLine();
        this.nodes.push(block);
        this.writtenTo = this.pos = this.pos + block.length;
        if (block.type != BlockType.WidgetBefore)
            this.covering = block;
    }
    addLineDeco(height, length) {
        let line = this.ensureLine();
        line.length += length;
        line.collapsed += length;
        line.widgetHeight = Math.max(line.widgetHeight, height);
        this.writtenTo = this.pos = this.pos + length;
    }
    finish(from) {
        let last = this.nodes.length == 0 ? null : this.nodes[this.nodes.length - 1];
        if (this.lineStart > -1 && !(last instanceof HeightMapText) && !this.isCovered)
            this.nodes.push(new HeightMapText(0, -1));
        else if (this.writtenTo < this.pos || last == null)
            this.nodes.push(new HeightMapGap(this.pos - this.writtenTo));
        let pos = from;
        for (let node of this.nodes) {
            if (node instanceof HeightMapText)
                node.updateHeight(this.oracle, pos);
            pos += node ? node.length : 1;
        }
        return this.nodes;
    }
    // Always called with a region that on both sides either stretches
    // to a line break or the end of the document.
    // The returned array uses null to indicate line breaks, but never
    // starts or ends in a line break, or has multiple line breaks next
    // to each other.
    static build(oracle, decorations, from, to) {
        let builder = new NodeBuilder(from, oracle);
        RangeSet.spans(decorations, from, to, builder);
        return builder.finish(from);
    }
    get minPointSize() { return 0; }
}
function heightRelevantDecoChanges(a, b, diff) {
    let comp = new DecorationComparator();
    RangeSet.compare(a, b, diff, comp);
    return comp.changes;
}
class DecorationComparator {
    constructor() {
        this.changes = [];
    }
    compareRange() { }
    comparePoint(from, to, a, b) {
        if (from < to || a && a.heightRelevant || b && b.heightRelevant)
            addRange(from, to, this.changes);
    }
    get minPointSize() { return 0; }
}

const none$3 = [];
const clickAddsSelectionRange = Facet.define();
const dragMovesSelection = Facet.define();
const mouseSelectionStyle = Facet.define();
const exceptionSink = Facet.define();
/// Log or report an unhandled exception in client code. Should
/// probably only be used by extension code that allows client code to
/// provide functions, and calls those functions in a context where an
/// exception can't be propagated to calling code in a reasonable way
/// (for example when in an event handler).
///
/// Either calls a handler registered with
/// [`EditorView.exceptionSink`](#view.EditorView^exceptionSink),
/// `window.onerror`, if defined, or `console.error` (in which case
/// it'll pass `context`, when given, as first argument).
function logException(state, exception, context) {
    let handler = state.facet(exceptionSink);
    if (handler.length)
        handler[0](exception);
    else if (window.onerror)
        window.onerror(String(exception), context, undefined, undefined, exception);
    else if (context)
        console.error(context + ":", exception);
    else
        console.error(exception);
}
const editable = Facet.define({ combine: values => values.length ? values[0] : true });
/// Plugin fields are a mechanism for allowing plugins to provide
/// values that can be retrieved through the
/// [`pluginField`](#view.EditorView.pluginField) view method.
class PluginField {
    static define() { return new PluginField(); }
}
/// Plugins can provide additional scroll margins (space around the
/// sides of the scrolling element that should be considered
/// invisible) through this field. This can be useful when the
/// plugin introduces elements that cover part of that element (for
/// example a horizontally fixed gutter).
PluginField.scrollMargins = PluginField.define();
let nextPluginID = 0;
const viewPlugin = Facet.define();
/// View plugins associate stateful values with a view. They can
/// influence the way the content is drawn, and are notified of things
/// that happen in the view.
class ViewPlugin {
    constructor(
    /// @internal
    id, 
    /// @internal
    create, 
    /// @internal
    fields) {
        this.id = id;
        this.create = create;
        this.fields = fields;
        this.extension = viewPlugin.of(this);
    }
    /// Define a plugin from a constructor function that creates the
    /// plugin's value, given an editor view.
    static define(create) {
        return new ViewPlugin(nextPluginID++, create, []);
    }
    /// Create a plugin for a class whose constructor takes a single
    /// editor view as argument.
    static fromClass(cls) {
        return ViewPlugin.define(view => new cls(view));
    }
    /// Create a new version of this plugin that provides a given
    /// [plugin field](#view.PluginField).
    provide(field, get) {
        return new ViewPlugin(this.id, this.create, this.fields.concat({ field, get }));
    }
    decorations(get) {
        return this.provide(pluginDecorations, get || ((value) => value.decorations));
    }
    eventHandlers(handlers) {
        return this.provide(domEventHandlers, (value) => ({ plugin: value, handlers }));
    }
}
// FIXME somehow ensure that no replacing decorations end up in here
const pluginDecorations = PluginField.define();
const domEventHandlers = PluginField.define();
class PluginInstance {
    constructor(value, spec) {
        this.value = value;
        this.spec = spec;
        this.updateFunc = this.value.update ? this.value.update.bind(this.value) : () => undefined;
    }
    static create(spec, view) {
        let value;
        try {
            value = spec.create(view);
        }
        catch (e) {
            logException(view.state, e, "CodeMirror plugin crashed");
            return PluginInstance.dummy;
        }
        return new PluginInstance(value, spec);
    }
    takeField(type, target) {
        for (let { field, get } of this.spec.fields)
            if (field == type)
                target.push(get(this.value));
    }
    update(update) {
        try {
            this.updateFunc(update);
            return this;
        }
        catch (e) {
            logException(update.state, e, "CodeMirror plugin crashed");
            if (this.value.destroy)
                try {
                    this.value.destroy();
                }
                catch (_) { }
            return PluginInstance.dummy;
        }
    }
    destroy(view) {
        try {
            if (this.value.destroy)
                this.value.destroy();
        }
        catch (e) {
            logException(view.state, e, "CodeMirror plugin crashed");
        }
    }
}
PluginInstance.dummy = new PluginInstance({}, ViewPlugin.define(() => ({})));
const editorAttributes = Facet.define({
    combine: values => values.reduce((a, b) => combineAttrs(b, a), {})
});
const contentAttributes = Facet.define({
    combine: values => values.reduce((a, b) => combineAttrs(b, a), {})
});
// Provide decorations
const decorations = Facet.define();
const styleModule = Facet.define();
class ChangedRange {
    constructor(fromA, toA, fromB, toB) {
        this.fromA = fromA;
        this.toA = toA;
        this.fromB = fromB;
        this.toB = toB;
    }
    join(other) {
        return new ChangedRange(Math.min(this.fromA, other.fromA), Math.max(this.toA, other.toA), Math.min(this.fromB, other.fromB), Math.max(this.toB, other.toB));
    }
    addToSet(set) {
        let i = set.length, me = this;
        for (; i > 0; i--) {
            let range = set[i - 1];
            if (range.fromA > me.toA)
                continue;
            if (range.toA < me.fromA)
                break;
            me = me.join(range);
            set.splice(i - 1, 1);
        }
        set.splice(i, 0, me);
        return set;
    }
    static extendWithRanges(diff, ranges) {
        if (ranges.length == 0)
            return diff;
        let result = [];
        for (let dI = 0, rI = 0, posA = 0, posB = 0;; dI++) {
            let next = dI == diff.length ? null : diff[dI], off = posA - posB;
            let end = next ? next.fromB : 1e9;
            while (rI < ranges.length && ranges[rI] < end) {
                let from = ranges[rI], to = ranges[rI + 1];
                let fromB = Math.max(posB, from), toB = Math.min(end, to);
                if (fromB <= toB)
                    new ChangedRange(fromB + off, toB + off, fromB, toB).addToSet(result);
                if (to > end)
                    break;
                else
                    rI += 2;
            }
            if (!next)
                return result;
            new ChangedRange(next.fromA, next.toA, next.fromB, next.toB).addToSet(result);
            posA = next.toA;
            posB = next.toB;
        }
    }
}
/// View [plugins](#view.ViewPlugin) are given instances of this
/// class, which describe what happened, whenever the view is updated.
class ViewUpdate {
    /// @internal
    constructor(
    /// The editor view that the update is associated with.
    view, 
    /// The new editor state.
    state, 
    /// The transactions involved in the update. May be empty.
    transactions = none$3) {
        this.view = view;
        this.state = state;
        this.transactions = transactions;
        /// @internal
        this.flags = 0;
        this.prevState = view.state;
        this.changes = ChangeSet.empty(this.prevState.doc.length);
        for (let tr of transactions)
            this.changes = this.changes.compose(tr.changes);
        let changedRanges = [];
        this.changes.iterChangedRanges((fromA, toA, fromB, toB) => changedRanges.push(new ChangedRange(fromA, toA, fromB, toB)));
        this.changedRanges = changedRanges;
        let focus = view.hasFocus;
        if (focus != view.inputState.notifiedFocused) {
            view.inputState.notifiedFocused = focus;
            this.flags != 1 /* Focus */;
        }
        if (this.docChanged)
            this.flags |= 2 /* Height */;
    }
    /// Tells you whether the viewport changed in this update.
    get viewportChanged() {
        return (this.flags & 4 /* Viewport */) > 0;
    }
    /// Indicates whether the line height in the editor changed in this update.
    get heightChanged() {
        return (this.flags & 2 /* Height */) > 0;
    }
    /// True when this update indicates a focus change.
    get focusChanged() {
        return (this.flags & 1 /* Focus */) > 0;
    }
    /// Whether the document changed in this update.
    get docChanged() {
        return this.transactions.some(tr => tr.docChanged);
    }
    /// Whether the selection was explicitly set in this update.
    get selectionSet() {
        return this.transactions.some(tr => tr.selection);
    }
    /// @internal
    get empty() { return this.flags == 0 && this.transactions.length == 0; }
}

function visiblePixelRange(dom, paddingTop) {
    let rect = dom.getBoundingClientRect();
    let left = Math.max(0, rect.left), right = Math.min(innerWidth, rect.right);
    let top = Math.max(0, rect.top), bottom = Math.min(innerHeight, rect.bottom);
    for (let parent = dom.parentNode; parent;) { // (Cast to any because TypeScript is useless with Node types)
        if (parent.nodeType == 1) {
            if ((parent.scrollHeight > parent.clientHeight || parent.scrollWidth > parent.clientWidth) &&
                window.getComputedStyle(parent).overflow != "visible") {
                let parentRect = parent.getBoundingClientRect();
                left = Math.max(left, parentRect.left);
                right = Math.min(right, parentRect.right);
                top = Math.max(top, parentRect.top);
                bottom = Math.min(bottom, parentRect.bottom);
            }
            parent = parent.parentNode;
        }
        else if (parent.nodeType == 11) { // Shadow root
            parent = parent.host;
        }
        else {
            break;
        }
    }
    return { left: left - rect.left, right: right - rect.left,
        top: top - (rect.top + paddingTop), bottom: bottom - (rect.top + paddingTop) };
}
// Line gaps are placeholder widgets used to hide pieces of overlong
// lines within the viewport, as a kludge to keep the editor
// responsive when a ridiculously long line is loaded into it.
class LineGap {
    constructor(from, to, size) {
        this.from = from;
        this.to = to;
        this.size = size;
    }
    static same(a, b) {
        if (a.length != b.length)
            return false;
        for (let i = 0; i < a.length; i++) {
            let gA = a[i], gB = b[i];
            if (gA.from != gB.from || gA.to != gB.to || gA.size != gB.size)
                return false;
        }
        return true;
    }
    draw(wrapping) {
        return Decoration.replace({ widget: new LineGapWidget({ size: this.size, vertical: wrapping }) }).range(this.from, this.to);
    }
}
class LineGapWidget extends WidgetType {
    toDOM() {
        let elt = document.createElement("div");
        if (this.value.vertical) {
            elt.style.height = this.value.size + "px";
        }
        else {
            elt.style.width = this.value.size + "px";
            elt.style.height = "2px";
            elt.style.display = "inline-block";
        }
        return elt;
    }
    eq(other) { return this.value.size == other.size && this.value.vertical == other.vertical; }
    get estimatedHeight() { return this.value.vertical ? this.value.size : -1; }
}
class ViewState {
    constructor(state) {
        this.state = state;
        // These are contentDOM-local coordinates
        this.pixelViewport = { left: 0, right: window.innerWidth, top: 0, bottom: 0 };
        this.paddingTop = 0;
        this.paddingBottom = 0;
        this.heightOracle = new HeightOracle;
        this.heightMap = HeightMap.empty();
        this.scrollTo = null;
        // Briefly set to true when printing, to disable viewport limiting
        this.printing = false;
        this.visibleRanges = [];
        // Cursor 'assoc' is only significant when the cursor is on a line
        // wrap point, where it must stick to the character that it is
        // associated with. Since browsers don't provide a reasonable
        // interface to set or query this, when a selection is set that
        // might cause this to be signficant, this flag is set. The next
        // measure phase will check whether the cursor is on a line-wrapping
        // boundary and, if so, reset it to make sure it is positioned in
        // the right place.
        this.mustEnforceCursorAssoc = false;
        this.heightMap = this.heightMap.applyChanges(state.facet(decorations), Text.empty, this.heightOracle.setDoc(state.doc), [new ChangedRange(0, 0, 0, state.doc.length)]);
        this.viewport = this.getViewport(0, null);
        this.lineGaps = this.ensureLineGaps([]);
        this.lineGapDeco = Decoration.set(this.lineGaps.map(gap => gap.draw(false)));
        this.computeVisibleRanges();
    }
    update(update, scrollTo = null) {
        let prev = this.state;
        this.state = update.state;
        let newDeco = this.state.facet(decorations);
        let contentChanges = update.changedRanges;
        let heightChanges = ChangedRange.extendWithRanges(contentChanges, heightRelevantDecoChanges(update.prevState.facet(decorations), newDeco, update ? update.changes : ChangeSet.empty(this.state.doc.length)));
        let prevHeight = this.heightMap.height;
        this.heightMap = this.heightMap.applyChanges(newDeco, prev.doc, this.heightOracle.setDoc(this.state.doc), heightChanges);
        if (this.heightMap.height != prevHeight)
            update.flags |= 2 /* Height */;
        let viewport = heightChanges.length ? this.mapViewport(this.viewport, update.changes) : this.viewport;
        if (scrollTo && (scrollTo.head < viewport.from || scrollTo.head > viewport.to) || !this.viewportIsAppropriate(viewport))
            viewport = this.getViewport(0, scrollTo);
        if (!viewport.eq(this.viewport)) {
            this.viewport = viewport;
            update.flags |= 4 /* Viewport */;
        }
        if (this.lineGaps.length || this.viewport.to - this.viewport.from > 15000 /* MinViewPort */)
            update.flags |= this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps, update.changes)));
        this.computeVisibleRanges();
        if (scrollTo)
            this.scrollTo = scrollTo;
        if (!this.mustEnforceCursorAssoc && update.selectionSet && update.view.lineWrapping &&
            update.state.selection.primary.empty && update.state.selection.primary.assoc)
            this.mustEnforceCursorAssoc = true;
    }
    measure(docView, repeated) {
        let dom = docView.dom, whiteSpace = "", direction = Direction.LTR;
        if (!repeated) {
            // Vertical padding
            let style = window.getComputedStyle(dom);
            whiteSpace = style.whiteSpace, direction = (style.direction == "rtl" ? Direction.RTL : Direction.LTR);
            this.paddingTop = parseInt(style.paddingTop) || 0;
            this.paddingBottom = parseInt(style.paddingBottom) || 0;
        }
        // Pixel viewport
        let pixelViewport = this.printing ? { top: -1e8, bottom: 1e8, left: -1e8, right: 1e8 } : visiblePixelRange(dom, this.paddingTop);
        let dTop = pixelViewport.top - this.pixelViewport.top, dBottom = pixelViewport.bottom - this.pixelViewport.bottom;
        this.pixelViewport = pixelViewport;
        if (this.pixelViewport.bottom <= this.pixelViewport.top ||
            this.pixelViewport.right <= this.pixelViewport.left)
            return 0;
        let lineHeights = docView.measureVisibleLineHeights();
        let refresh = false, bias = 0;
        if (!repeated) {
            if (this.heightOracle.mustRefresh(lineHeights, whiteSpace, direction)) {
                let { lineHeight, charWidth } = docView.measureTextSize();
                refresh = this.heightOracle.refresh(whiteSpace, direction, lineHeight, charWidth, (docView.dom).clientWidth / charWidth, lineHeights);
                if (refresh)
                    docView.minWidth = 0;
            }
            if (dTop > 0 && dBottom > 0)
                bias = Math.max(dTop, dBottom);
            else if (dTop < 0 && dBottom < 0)
                bias = Math.min(dTop, dBottom);
        }
        this.heightOracle.heightChanged = false;
        this.heightMap = this.heightMap.updateHeight(this.heightOracle, 0, refresh, new MeasuredHeights(this.viewport.from, lineHeights));
        let result = this.heightOracle.heightChanged ? 2 /* Height */ : 0;
        if (!this.viewportIsAppropriate(this.viewport, bias) ||
            this.scrollTo && (this.scrollTo.head < this.viewport.from || this.scrollTo.head > this.viewport.to)) {
            this.viewport = this.getViewport(bias, this.scrollTo);
            result |= 4 /* Viewport */;
        }
        if (this.lineGaps.length || this.viewport.to - this.viewport.from > 15000 /* MinViewPort */)
            result |= this.updateLineGaps(this.ensureLineGaps(refresh ? [] : this.lineGaps));
        this.computeVisibleRanges();
        if (this.mustEnforceCursorAssoc) {
            this.mustEnforceCursorAssoc = false;
            // This is done in the read stage, because moving the selection
            // to a line end is going to trigger a layout anyway, so it
            // can't be a pure write. It should be rare that it does any
            // writing.
            docView.enforceCursorAssoc();
        }
        return result;
    }
    getViewport(bias, scrollTo) {
        // This will divide VP.Margin between the top and the
        // bottom, depending on the bias (the change in viewport position
        // since the last update). It'll hold a number between 0 and 1
        let marginTop = 0.5 - Math.max(-0.5, Math.min(0.5, bias / 1000 /* Margin */ / 2));
        let map = this.heightMap, doc = this.state.doc, { top, bottom } = this.pixelViewport;
        let viewport = new Viewport(map.lineAt(top - marginTop * 1000 /* Margin */, QueryType.ByHeight, doc, 0, 0).from, map.lineAt(bottom + (1 - marginTop) * 1000 /* Margin */, QueryType.ByHeight, doc, 0, 0).to);
        // If scrollTo is given, make sure the viewport includes that position
        if (scrollTo) {
            if (scrollTo.head < viewport.from) {
                let { top: newTop } = map.lineAt(scrollTo.head, QueryType.ByPos, doc, 0, 0);
                viewport = new Viewport(map.lineAt(newTop - 1000 /* Margin */ / 2, QueryType.ByHeight, doc, 0, 0).from, map.lineAt(newTop + (bottom - top) + 1000 /* Margin */ / 2, QueryType.ByHeight, doc, 0, 0).to);
            }
            else if (scrollTo.head > viewport.to) {
                let { bottom: newBottom } = map.lineAt(scrollTo.head, QueryType.ByPos, doc, 0, 0);
                viewport = new Viewport(map.lineAt(newBottom - (bottom - top) - 1000 /* Margin */ / 2, QueryType.ByHeight, doc, 0, 0).from, map.lineAt(newBottom + 1000 /* Margin */ / 2, QueryType.ByHeight, doc, 0, 0).to);
            }
        }
        return viewport;
    }
    mapViewport(viewport, changes) {
        let from = changes.mapPos(viewport.from, -1), to = changes.mapPos(viewport.to, 1);
        return new Viewport(this.heightMap.lineAt(from, QueryType.ByPos, this.state.doc, 0, 0).from, this.heightMap.lineAt(to, QueryType.ByPos, this.state.doc, 0, 0).to);
    }
    // Checks if a given viewport covers the visible part of the
    // document and not too much beyond that.
    viewportIsAppropriate({ from, to }, bias = 0) {
        let { top } = this.heightMap.lineAt(from, QueryType.ByPos, this.state.doc, 0, 0);
        let { bottom } = this.heightMap.lineAt(to, QueryType.ByPos, this.state.doc, 0, 0);
        return (from == 0 || top <= this.pixelViewport.top - Math.max(10 /* MinCoverMargin */, Math.min(-bias, 250 /* MaxCoverMargin */))) &&
            (to == this.state.doc.length ||
                bottom >= this.pixelViewport.bottom + Math.max(10 /* MinCoverMargin */, Math.min(bias, 250 /* MaxCoverMargin */))) &&
            (top > this.pixelViewport.top - 2 * 1000 /* Margin */ && bottom < this.pixelViewport.bottom + 2 * 1000 /* Margin */);
    }
    mapLineGaps(gaps, changes) {
        if (!gaps.length || changes.empty)
            return gaps;
        let mapped = [];
        for (let gap of gaps)
            if (!changes.touchesRange(gap.from, gap.to))
                mapped.push(new LineGap(changes.mapPos(gap.from), changes.mapPos(gap.to), gap.size));
        return mapped;
    }
    // Computes positions in the viewport where the start or end of a
    // line should be hidden, trying to reuse existing line gaps when
    // appropriate to avoid unneccesary redraws.
    // Uses crude character-counting for the positioning and sizing,
    // since actual DOM coordinates aren't always available and
    // predictable. Relies on generous margins (see LG.Margin) to hide
    // the artifacts this might produce from the user.
    ensureLineGaps(current) {
        let gaps = [];
        // This won't work at all in predominantly right-to-left text.
        if (this.heightOracle.direction != Direction.LTR)
            return gaps;
        this.heightMap.forEachLine(this.viewport.from, this.viewport.to, this.state.doc, 0, 0, line => {
            if (line.length < 10000 /* Margin */)
                return;
            let structure = lineStructure(line.from, line.to, this.state);
            if (structure.total < 10000 /* Margin */)
                return;
            let viewFrom, viewTo;
            if (this.heightOracle.lineWrapping) {
                if (line.from != this.viewport.from)
                    viewFrom = line.from;
                else
                    viewFrom = findPosition(structure, (this.pixelViewport.top - line.top) / line.height);
                if (line.to != this.viewport.to)
                    viewTo = line.to;
                else
                    viewTo = findPosition(structure, (this.pixelViewport.bottom - line.top) / line.height);
            }
            else {
                let totalWidth = structure.total * this.heightOracle.charWidth;
                viewFrom = findPosition(structure, this.pixelViewport.left / totalWidth);
                viewTo = findPosition(structure, this.pixelViewport.right / totalWidth);
            }
            let sel = this.state.selection.primary;
            // Make sure the gap doesn't cover a selection end
            if (sel.from <= viewFrom && sel.to >= line.from)
                viewFrom = sel.from;
            if (sel.from <= line.to && sel.to >= viewTo)
                viewTo = sel.to;
            let gapTo = viewFrom - 10000 /* Margin */, gapFrom = viewTo + 10000 /* Margin */;
            if (gapTo > line.from + 5000 /* HalfMargin */)
                gaps.push(find(current, gap => gap.from == line.from && gap.to > gapTo - 5000 /* HalfMargin */ && gap.to < gapTo + 5000 /* HalfMargin */) ||
                    new LineGap(line.from, gapTo, this.gapSize(line, gapTo, true, structure)));
            if (gapFrom < line.to - 5000 /* HalfMargin */)
                gaps.push(find(current, gap => gap.to == line.to && gap.from > gapFrom - 5000 /* HalfMargin */ &&
                    gap.from < gapFrom + 5000 /* HalfMargin */) ||
                    new LineGap(gapFrom, line.to, this.gapSize(line, gapFrom, false, structure)));
        });
        return gaps;
    }
    gapSize(line, pos, start, structure) {
        if (this.heightOracle.lineWrapping) {
            let height = line.height * findFraction(structure, pos);
            return start ? height : line.height - height;
        }
        else {
            let ratio = findFraction(structure, pos);
            return structure.total * this.heightOracle.charWidth * (start ? ratio : 1 - ratio);
        }
    }
    updateLineGaps(gaps) {
        if (!LineGap.same(gaps, this.lineGaps)) {
            this.lineGaps = gaps;
            this.lineGapDeco = Decoration.set(gaps.map(gap => gap.draw(this.heightOracle.lineWrapping)));
            return 16 /* LineGaps */;
        }
        return 0;
    }
    computeVisibleRanges() {
        let deco = this.state.facet(decorations);
        if (this.lineGaps.length)
            deco = deco.concat(this.lineGapDeco);
        let ranges = [];
        RangeSet.spans(deco, this.viewport.from, this.viewport.to, {
            span(from, to) { ranges.push({ from, to }); },
            point() { },
            minPointSize: 20
        });
        this.visibleRanges = ranges;
    }
    lineAt(pos, editorTop) {
        return this.heightMap.lineAt(pos, QueryType.ByPos, this.state.doc, editorTop + this.paddingTop, 0);
    }
    lineAtHeight(height, editorTop) {
        return this.heightMap.lineAt(height, QueryType.ByHeight, this.state.doc, editorTop + this.paddingTop, 0);
    }
    blockAtHeight(height, editorTop) {
        return this.heightMap.blockAt(height, this.state.doc, editorTop + this.paddingTop, 0);
    }
    forEachLine(from, to, f, editorTop) {
        return this.heightMap.forEachLine(from, to, this.state.doc, editorTop + this.paddingTop, 0, f);
    }
}
/// Indicates the range of the document that is in the visible
/// viewport.
class Viewport {
    constructor(from, to) {
        this.from = from;
        this.to = to;
    }
    eq(b) { return this.from == b.from && this.to == b.to; }
}
function lineStructure(from, to, state) {
    let ranges = [], pos = from, total = 0;
    RangeSet.spans(state.facet(decorations), from, to, {
        span() { },
        point(from, to) {
            if (from > pos) {
                ranges.push({ from: pos, to: from });
                total += from - pos;
            }
            pos = to;
        },
        minPointSize: 20 // We're only interested in collapsed ranges of a significant size
    });
    if (pos < to) {
        ranges.push({ from: pos, to });
        total += to - pos;
    }
    return { total, ranges };
}
function findPosition({ total, ranges }, ratio) {
    if (ratio <= 0)
        return ranges[0].from;
    if (ratio >= 1)
        return ranges[ranges.length - 1].to;
    let dist = Math.floor(total * ratio);
    for (let i = 0;; i++) {
        let { from, to } = ranges[i], size = to - from;
        if (dist <= size)
            return from + dist;
        dist -= size;
    }
}
function findFraction(structure, pos) {
    let counted = 0;
    for (let { from, to } of structure.ranges) {
        if (pos <= to) {
            counted += pos - from;
            break;
        }
        counted += to - from;
    }
    return counted / structure.total;
}
function find(array, f) {
    for (let val of array)
        if (f(val))
            return val;
    return undefined;
}

const none$4 = [];
class DocView extends ContentView {
    constructor(view) {
        super();
        this.view = view;
        this.viewports = none$4;
        this.compositionDeco = Decoration.none;
        this.decorations = [];
        // Track a minimum width for the editor. When measuring sizes in
        // checkLayout, this is updated to point at the width of a given
        // element and its extent in the document. When a change happens in
        // that range, these are reset. That way, once we've seen a
        // line/element of a given length, we keep the editor wide enough to
        // fit at least that element, until it is changed, at which point we
        // forget it again.
        this.minWidth = 0;
        this.minWidthFrom = 0;
        this.minWidthTo = 0;
        // Track whether the DOM selection was set in a lossy way, so that
        // we don't mess it up when reading it back it
        this.impreciseAnchor = null;
        this.impreciseHead = null;
        this.setDOM(view.contentDOM);
        this.children = [new LineView];
        this.children[0].setParent(this);
        this.updateInner([new ChangedRange(0, 0, 0, view.state.doc.length)], this.updateDeco(), 0);
    }
    get root() { return this.view.root; }
    get editorView() { return this.view; }
    get length() { return this.view.state.doc.length; }
    // Update the document view to a given state. scrollIntoView can be
    // used as a hint to compute a new viewport that includes that
    // position, if we know the editor is going to scroll that position
    // into view.
    update(update) {
        var _a;
        let changedRanges = update.changedRanges;
        if (this.minWidth > 0 && changedRanges.length) {
            if (!changedRanges.every(({ fromA, toA }) => toA < this.minWidthFrom || fromA > this.minWidthTo)) {
                this.minWidth = 0;
            }
            else {
                this.minWidthFrom = update.changes.mapPos(this.minWidthFrom, 1);
                this.minWidthTo = update.changes.mapPos(this.minWidthTo, 1);
            }
        }
        // When the DOM nodes around the selection are moved to another
        // parent, Chrome sometimes reports a different selection through
        // getSelection than the one that it actually shows to the user.
        // This forces a selection update when lines are joined to work
        // around that. Issue #54
        let forceSelection = browser.chrome && !this.compositionDeco.size && update &&
            update.state.doc.lines != update.prevState.doc.lines;
        if (!((_a = this.view.inputState) === null || _a === void 0 ? void 0 : _a.composing))
            this.compositionDeco = Decoration.none;
        else if (update.transactions.length)
            this.compositionDeco = computeCompositionDeco(this.view, update.changes);
        let prevDeco = this.decorations, deco = this.updateDeco();
        let decoDiff = findChangedDeco(prevDeco, deco, update.changes);
        changedRanges = ChangedRange.extendWithRanges(changedRanges, decoDiff);
        let pointerSel = update.transactions.some(tr => tr.annotation(Transaction.userEvent) == "pointerselection");
        if (this.dirty == 0 /* Not */ && changedRanges.length == 0 &&
            !(update.flags & (4 /* Viewport */ | 16 /* LineGaps */)) &&
            update.state.selection.primary.from >= this.view.viewport.from &&
            update.state.selection.primary.to <= this.view.viewport.to) {
            this.updateSelection(forceSelection, pointerSel);
            return false;
        }
        else {
            this.updateInner(changedRanges, deco, update.prevState.doc.length, forceSelection, pointerSel);
            return true;
        }
    }
    // Used both by update and checkLayout do perform the actual DOM
    // update
    updateInner(changes, deco, oldLength, forceSelection = false, pointerSel = false) {
        this.updateChildren(changes, deco, oldLength);
        this.view.observer.ignore(() => {
            // Lock the height during redrawing, since Chrome sometimes
            // messes with the scroll position during DOM mutation (though
            // no relayout is triggered and I cannot imagine how it can
            // recompute the scroll position without a layout)
            this.dom.style.height = this.view.viewState.heightMap.height + "px";
            this.dom.style.minWidth = this.minWidth ? this.minWidth + "px" : "";
            this.sync();
            this.dirty = 0 /* Not */;
            this.updateSelection(forceSelection, pointerSel);
            this.dom.style.height = "";
        });
    }
    updateChildren(changes, deco, oldLength) {
        let cursor = this.childCursor(oldLength);
        for (let i = changes.length - 1;; i--) {
            let next = i >= 0 ? changes[i] : null;
            if (!next)
                break;
            let { fromA, toA, fromB, toB } = next;
            let { content, breakAtStart } = ContentBuilder.build(this.view.state.doc, fromB, toB, deco);
            let { i: toI, off: toOff } = cursor.findPos(toA, 1);
            let { i: fromI, off: fromOff } = cursor.findPos(fromA, -1);
            this.replaceRange(fromI, fromOff, toI, toOff, content, breakAtStart);
        }
    }
    replaceRange(fromI, fromOff, toI, toOff, content, breakAtStart) {
        let before = this.children[fromI], last = content.length ? content[content.length - 1] : null;
        let breakAtEnd = last ? last.breakAfter : breakAtStart;
        // Change within a single line
        if (fromI == toI && !breakAtStart && !breakAtEnd && content.length < 2 &&
            before.merge(fromOff, toOff, content.length ? last : null, fromOff == 0))
            return;
        let after = this.children[toI];
        // Make sure the end of the line after the update is preserved in `after`
        if (toOff < after.length || after.children.length && after.children[after.children.length - 1].length == 0) {
            // If we're splitting a line, separate part of the start line to
            // avoid that being mangled when updating the start line.
            if (fromI == toI) {
                after = after.split(toOff);
                toOff = 0;
            }
            // If the element after the replacement should be merged with
            // the last replacing element, update `content`
            if (!breakAtEnd && last && after.merge(0, toOff, last, true)) {
                content[content.length - 1] = after;
            }
            else {
                // Remove the start of the after element, if necessary, and
                // add it to `content`.
                if (toOff || after.children.length && after.children[0].length == 0)
                    after.merge(0, toOff, null, false);
                content.push(after);
            }
        }
        else if (after.breakAfter) {
            // The element at `toI` is entirely covered by this range.
            // Preserve its line break, if any.
            if (last)
                last.breakAfter = 1;
            else
                breakAtStart = 1;
        }
        // Since we've handled the next element from the current elements
        // now, make sure `toI` points after that.
        toI++;
        before.breakAfter = breakAtStart;
        if (fromOff > 0) {
            if (!breakAtStart && content.length && before.merge(fromOff, before.length, content[0], false)) {
                before.breakAfter = content.shift().breakAfter;
            }
            else if (fromOff < before.length || before.children.length && before.children[before.children.length - 1].length == 0) {
                before.merge(fromOff, before.length, null, false);
            }
            fromI++;
        }
        // Try to merge widgets on the boundaries of the replacement
        while (fromI < toI && content.length) {
            if (this.children[toI - 1].match(content[content.length - 1]))
                toI--, content.pop();
            else if (this.children[fromI].match(content[0]))
                fromI++, content.shift();
            else
                break;
        }
        if (fromI < toI || content.length)
            this.replaceChildren(fromI, toI, content);
    }
    // Sync the DOM selection to this.state.selection
    updateSelection(force = false, fromPointer = false) {
        if (!(fromPointer || this.mayControlSelection()))
            return;
        let primary = this.view.state.selection.primary;
        // FIXME need to handle the case where the selection falls inside a block range
        let anchor = this.domAtPos(primary.anchor);
        let head = this.domAtPos(primary.head);
        let domSel = getSelection(this.root);
        // If the selection is already here, or in an equivalent position, don't touch it
        if (force || !domSel.focusNode ||
            (browser.gecko && primary.empty && nextToUneditable(domSel.focusNode, domSel.focusOffset)) ||
            !isEquivalentPosition(anchor.node, anchor.offset, domSel.anchorNode, domSel.anchorOffset) ||
            !isEquivalentPosition(head.node, head.offset, domSel.focusNode, domSel.focusOffset)) {
            this.view.observer.ignore(() => {
                if (primary.empty) {
                    // Work around https://bugzilla.mozilla.org/show_bug.cgi?id=1612076
                    if (browser.gecko) {
                        let nextTo = nextToUneditable(anchor.node, anchor.offset);
                        if (nextTo && nextTo != (1 /* Before */ | 2 /* After */)) {
                            let text = nearbyTextNode(anchor.node, anchor.offset, nextTo == 1 /* Before */ ? 1 : -1);
                            if (text)
                                anchor = new DOMPos(text, nextTo == 1 /* Before */ ? 0 : text.nodeValue.length);
                        }
                    }
                    domSel.collapse(anchor.node, anchor.offset);
                    if (primary.bidiLevel != null && domSel.cursorBidiLevel != null)
                        domSel.cursorBidiLevel = primary.bidiLevel;
                }
                else if (domSel.extend) {
                    // Selection.extend can be used to create an 'inverted' selection
                    // (one where the focus is before the anchor), but not all
                    // browsers support it yet.
                    domSel.collapse(anchor.node, anchor.offset);
                    domSel.extend(head.node, head.offset);
                }
                else {
                    // Primitive (IE) way
                    let range = document.createRange();
                    if (primary.anchor > primary.head)
                        [anchor, head] = [head, anchor];
                    range.setEnd(head.node, head.offset);
                    range.setStart(anchor.node, anchor.offset);
                    domSel.removeAllRanges();
                    domSel.addRange(range);
                }
            });
        }
        this.impreciseAnchor = anchor.precise ? null : new DOMPos(domSel.anchorNode, domSel.anchorOffset);
        this.impreciseHead = head.precise ? null : new DOMPos(domSel.focusNode, domSel.focusOffset);
    }
    enforceCursorAssoc() {
        let cursor = this.view.state.selection.primary;
        let sel = getSelection(this.root);
        if (!cursor.empty || !cursor.assoc || !sel.modify)
            return;
        let line = LineView.find(this, cursor.head); // FIXME provide view-line-range finding helper
        if (!line)
            return;
        let lineStart = line.posAtStart;
        if (cursor.head == lineStart || cursor.head == lineStart + line.length)
            return;
        let before = this.coordsAt(cursor.head, -1), after = this.coordsAt(cursor.head, 1);
        if (!before || !after || before.bottom > after.top)
            return;
        let dom = this.domAtPos(cursor.head + cursor.assoc);
        sel.collapse(dom.node, dom.offset);
        sel.modify("move", cursor.assoc < 0 ? "forward" : "backward", "lineboundary");
    }
    mayControlSelection() {
        return this.view.state.facet(editable) ? this.root.activeElement == this.dom : hasSelection(this.dom, getSelection(this.root));
    }
    nearest(dom) {
        for (let cur = dom; cur;) {
            let domView = ContentView.get(cur);
            if (domView && domView.rootView == this)
                return domView;
            cur = cur.parentNode;
        }
        return null;
    }
    posFromDOM(node, offset) {
        let view = this.nearest(node);
        if (!view)
            throw new RangeError("Trying to find position for a DOM position outside of the document");
        return view.localPosFromDOM(node, offset) + view.posAtStart;
    }
    domAtPos(pos) {
        let { i, off } = this.childCursor().findPos(pos, -1);
        for (; i < this.children.length - 1;) {
            let child = this.children[i];
            if (off < child.length || child instanceof LineView)
                break;
            i++;
            off = 0;
        }
        return this.children[i].domAtPos(off);
    }
    coordsAt(pos, side) {
        for (let off = this.length, i = this.children.length - 1;; i--) {
            let child = this.children[i], start = off - child.breakAfter - child.length;
            if (pos >= start && child.type != BlockType.WidgetAfter)
                return child.coordsAt(pos - start, side);
            off = start;
        }
    }
    measureVisibleLineHeights() {
        let result = [], { from, to } = this.view.viewState.viewport;
        let minWidth = Math.max(this.view.scrollDOM.clientWidth, this.minWidth) + 1;
        for (let pos = 0, i = 0; i < this.children.length; i++) {
            let child = this.children[i], end = pos + child.length;
            if (end > to)
                break;
            if (pos >= from) {
                result.push(child.dom.getBoundingClientRect().height);
                let width = child.dom.scrollWidth;
                if (width > minWidth) {
                    this.minWidth = minWidth = width;
                    this.minWidthFrom = pos;
                    this.minWidthTo = end;
                }
            }
            pos = end + child.breakAfter;
        }
        return result;
    }
    measureTextSize() {
        for (let child of this.children) {
            if (child instanceof LineView) {
                let measure = child.measureTextSize();
                if (measure)
                    return measure;
            }
        }
        // If no workable line exists, force a layout of a measurable element
        let dummy = document.createElement("div"), lineHeight, charWidth;
        dummy.className = "cm-line";
        dummy.textContent = "abc def ghi jkl mno pqr stu";
        this.view.observer.ignore(() => {
            this.dom.appendChild(dummy);
            let rect = clientRectsFor(dummy.firstChild)[0];
            lineHeight = dummy.getBoundingClientRect().height;
            charWidth = rect ? rect.width / 27 : 7;
            dummy.remove();
        });
        return { lineHeight, charWidth };
    }
    childCursor(pos = this.length) {
        // Move back to start of last element when possible, so that
        // `ChildCursor.findPos` doesn't have to deal with the edge case
        // of being after the last element.
        let i = this.children.length;
        if (i)
            pos -= this.children[--i].length;
        return new ChildCursor(this.children, pos, i);
    }
    computeBlockGapDeco() {
        let visible = this.view.viewState.viewport, viewports = [visible];
        let { head, anchor } = this.view.state.selection.primary;
        if (head < visible.from || head > visible.to) {
            let { from, to } = this.view.viewState.lineAt(head, 0);
            viewports.push(new Viewport(from, to));
        }
        if (!viewports.some(({ from, to }) => anchor >= from && anchor <= to)) {
            let { from, to } = this.view.viewState.lineAt(anchor, 0);
            viewports.push(new Viewport(from, to));
        }
        this.viewports = viewports.sort((a, b) => a.from - b.from);
        let deco = [];
        for (let pos = 0, i = 0;; i++) {
            let next = i == viewports.length ? null : viewports[i];
            let end = next ? next.from - 1 : this.length;
            if (end > pos) {
                let height = this.view.viewState.lineAt(end, 0).bottom - this.view.viewState.lineAt(pos, 0).top;
                deco.push(Decoration.replace({ widget: new BlockGapWidget(height), block: true, inclusive: true }).range(pos, end));
            }
            if (!next)
                break;
            pos = next.to + 1;
        }
        return Decoration.set(deco);
    }
    updateDeco() {
        return this.decorations = [
            ...this.view.state.facet(decorations),
            this.computeBlockGapDeco(),
            this.view.viewState.lineGapDeco,
            this.compositionDeco,
            ...this.view.pluginField(pluginDecorations)
        ];
    }
    scrollPosIntoView(pos, side) {
        let rect = this.coordsAt(pos, side);
        if (!rect)
            return;
        let mLeft = 0, mRight = 0, mTop = 0, mBottom = 0;
        for (let margins of this.view.pluginField(PluginField.scrollMargins))
            if (margins) {
                let { left, right, top, bottom } = margins;
                if (left != null)
                    mLeft = Math.max(mLeft, left);
                if (right != null)
                    mRight = Math.max(mRight, right);
                if (top != null)
                    mTop = Math.max(mTop, top);
                if (bottom != null)
                    mBottom = Math.max(mBottom, bottom);
            }
        scrollRectIntoView(this.dom, {
            left: rect.left - mLeft, top: rect.top - mTop,
            right: rect.right + mRight, bottom: rect.bottom + mBottom
        });
    }
}
// Browsers appear to reserve a fixed amount of bits for height
// styles, and ignore or clip heights above that. For Chrome and
// Firefox, this is in the 20 million range, so we try to stay below
// that.
const MaxNodeHeight = 1e7;
class BlockGapWidget extends WidgetType {
    toDOM() {
        let elt = document.createElement("div");
        this.updateDOM(elt);
        return elt;
    }
    updateDOM(elt) {
        if (this.value < MaxNodeHeight) {
            while (elt.lastChild)
                elt.lastChild.remove();
            elt.style.height = this.value + "px";
        }
        else {
            elt.style.height = "";
            for (let remaining = this.value; remaining > 0; remaining -= MaxNodeHeight) {
                let fill = elt.appendChild(document.createElement("div"));
                fill.style.height = Math.min(remaining, MaxNodeHeight) + "px";
            }
        }
        return true;
    }
    get estimatedHeight() { return this.value; }
}
function computeCompositionDeco(view, changes) {
    let sel = getSelection(view.root);
    let textNode = sel.focusNode && nearbyTextNode(sel.focusNode, sel.focusOffset, 0);
    if (!textNode)
        return Decoration.none;
    let cView = view.docView.nearest(textNode);
    let from, to, topNode = textNode;
    if (cView instanceof InlineView) {
        from = cView.posAtStart;
        to = from + cView.length;
        topNode = cView.dom;
    }
    else if (cView instanceof LineView) {
        while (topNode.parentNode != cView.dom)
            topNode = topNode.parentNode;
        let prev = topNode.previousSibling;
        while (prev && !ContentView.get(prev))
            prev = prev.previousSibling;
        from = to = prev ? ContentView.get(prev).posAtEnd : cView.posAtStart;
    }
    else {
        return Decoration.none;
    }
    let newFrom = changes.mapPos(from, 1), newTo = Math.max(newFrom, changes.mapPos(to, -1));
    let text = textNode.nodeValue, { state } = view;
    if (newTo - newFrom < text.length) {
        if (state.sliceDoc(newFrom, Math.min(state.doc.length, newFrom + text.length)) == text)
            newTo = newFrom + text.length;
        else if (state.sliceDoc(Math.max(0, newTo - text.length), newTo) == text)
            newFrom = newTo - text.length;
        else
            return Decoration.none;
    }
    else if (state.sliceDoc(newFrom, newTo) != text) {
        return Decoration.none;
    }
    return Decoration.set(Decoration.replace({ widget: new CompositionWidget({ top: topNode, text: textNode }) }).range(newFrom, newTo));
}
class CompositionWidget extends WidgetType {
    eq(value) { return this.value.top == value.top && this.value.text == value.text; }
    toDOM() { return this.value.top; }
    ignoreEvent() { return false; }
    get customView() { return CompositionView; }
}
function nearbyTextNode(node, offset, side) {
    for (;;) {
        if (node.nodeType == 3)
            return node;
        if (node.nodeType == 1 && offset > 0 && side <= 0) {
            node = node.childNodes[offset - 1];
            offset = maxOffset(node);
        }
        else if (node.nodeType == 1 && offset < node.childNodes.length && side >= 0) {
            node = node.childNodes[offset];
            offset = 0;
        }
        else {
            return null;
        }
    }
}
function nextToUneditable(node, offset) {
    if (node.nodeType != 1)
        return 0;
    return (offset && node.childNodes[offset - 1].contentEditable == "false" ? 1 /* Before */ : 0) |
        (offset < node.childNodes.length && node.childNodes[offset].contentEditable == "false" ? 2 /* After */ : 0);
}
class DecorationComparator$1 {
    constructor() {
        this.changes = [];
    }
    compareRange(from, to) { addRange(from, to, this.changes); }
    comparePoint(from, to) { addRange(from, to, this.changes); }
}
function findChangedDeco(a, b, diff) {
    let comp = new DecorationComparator$1;
    RangeSet.compare(a, b, diff, comp);
    return comp.changes;
}

function groupAt(state, pos, bias = 1) {
    let categorize = state.charCategorizer(pos);
    let line = state.doc.lineAt(pos), linePos = pos - line.start;
    if (line.length == 0)
        return EditorSelection.cursor(pos);
    if (linePos == 0)
        bias = 1;
    else if (linePos == line.length)
        bias = -1;
    let from = linePos, to = linePos;
    if (bias < 0)
        from = line.findClusterBreak(linePos, false);
    else
        to = line.findClusterBreak(linePos, true);
    let cat = categorize(line.slice(from, to));
    while (from > 0) {
        let prev = line.findClusterBreak(from, false);
        if (categorize(line.slice(prev, from)) != cat)
            break;
        from = prev;
    }
    while (to < line.length) {
        let next = line.findClusterBreak(to, true);
        if (categorize(line.slice(to, next)) != cat)
            break;
        to = next;
    }
    return EditorSelection.range(from + line.start, to + line.start);
}
// Search the DOM for the {node, offset} position closest to the given
// coordinates. Very inefficient and crude, but can usually be avoided
// by calling caret(Position|Range)FromPoint instead.
// FIXME holding arrow-up/down at the end of the viewport is a rather
// common use case that will repeatedly trigger this code. Maybe
// introduce some element of binary search after all?
function getdx(x, rect) {
    return rect.left > x ? rect.left - x : Math.max(0, x - rect.right);
}
function getdy(y, rect) {
    return rect.top > y ? rect.top - y : Math.max(0, y - rect.bottom);
}
function yOverlap(a, b) {
    return a.top < b.bottom - 1 && a.bottom > b.top + 1;
}
function upTop(rect, top) {
    return top < rect.top ? { top, left: rect.left, right: rect.right, bottom: rect.bottom } : rect;
}
function upBot(rect, bottom) {
    return bottom > rect.bottom ? { top: rect.top, left: rect.left, right: rect.right, bottom } : rect;
}
function domPosAtCoords(parent, x, y) {
    let closest, closestRect, closestX, closestY;
    let above, below, aboveRect, belowRect;
    for (let child = parent.firstChild; child; child = child.nextSibling) {
        let rects = clientRectsFor(child);
        for (let i = 0; i < rects.length; i++) {
            let rect = rects[i];
            if (closestRect && yOverlap(closestRect, rect))
                rect = upTop(upBot(rect, closestRect.bottom), closestRect.top);
            let dx = getdx(x, rect), dy = getdy(y, rect);
            if (dx == 0 && dy == 0)
                return child.nodeType == 3 ? domPosInText(child, x, y) : domPosAtCoords(child, x, y);
            if (!closest || closestY > dy || closestY == dy && closestX > dx) {
                closest = child;
                closestRect = rect;
                closestX = dx;
                closestY = dy;
            }
            if (dx == 0) {
                if (y > rect.bottom && (!aboveRect || aboveRect.bottom < rect.bottom)) {
                    above = child;
                    aboveRect = rect;
                }
                else if (y < rect.top && (!belowRect || belowRect.top > rect.top)) {
                    below = child;
                    belowRect = rect;
                }
            }
            else if (aboveRect && yOverlap(aboveRect, rect)) {
                aboveRect = upBot(aboveRect, rect.bottom);
            }
            else if (belowRect && yOverlap(belowRect, rect)) {
                belowRect = upTop(belowRect, rect.top);
            }
        }
    }
    if (aboveRect && aboveRect.bottom >= y) {
        closest = above;
        closestRect = aboveRect;
    }
    else if (belowRect && belowRect.top <= y) {
        closest = below;
        closestRect = belowRect;
    }
    if (!closest)
        return { node: parent, offset: 0 };
    let clipX = Math.max(closestRect.left, Math.min(closestRect.right, x));
    if (closest.nodeType == 3)
        return domPosInText(closest, clipX, y);
    if (!closestX && closest.contentEditable == "true")
        return domPosAtCoords(closest, clipX, y);
    let offset = Array.prototype.indexOf.call(parent.childNodes, closest) +
        (x >= (closestRect.left + closestRect.right) / 2 ? 1 : 0);
    return { node: parent, offset };
}
function domPosInText(node, x, y) {
    let len = node.nodeValue.length, range = document.createRange();
    for (let i = 0; i < len; i++) {
        range.setEnd(node, i + 1);
        range.setStart(node, i);
        let rects = range.getClientRects();
        for (let j = 0; j < rects.length; j++) {
            let rect = rects[j];
            if (rect.top == rect.bottom)
                continue;
            if (rect.left - 1 <= x && rect.right + 1 >= x &&
                rect.top - 1 <= y && rect.bottom + 1 >= y) {
                let right = x >= (rect.left + rect.right) / 2, after = right;
                if (browser.webkit || browser.gecko) {
                    // Check for RTL on browsers that support getting client
                    // rects for empty ranges.
                    range.setEnd(node, i);
                    let rectBefore = range.getBoundingClientRect();
                    if (rectBefore.left == rect.right)
                        after = !right;
                }
                return { node, offset: i + (after ? 1 : 0) };
            }
        }
    }
    return { node, offset: 0 };
}
function posAtCoords(view, { x, y }, bias = -1) {
    let content = view.contentDOM.getBoundingClientRect(), block;
    let halfLine = view.defaultLineHeight / 2;
    for (let bounced = false;;) {
        block = view.blockAtHeight(y, content.top);
        if (block.top > y || block.bottom < y) {
            bias = block.top > y ? -1 : 1;
            y = Math.min(block.bottom - halfLine, Math.max(block.top + halfLine, y));
            if (bounced)
                return -1;
            else
                bounced = true;
        }
        if (block.type == BlockType.Text)
            break;
        y = bias > 0 ? block.bottom + halfLine : block.top - halfLine;
    }
    let lineStart = block.from;
    // If this is outside of the rendered viewport, we can't determine a position
    if (lineStart < view.viewport.from)
        return view.viewport.from == 0 ? 0 : -1;
    if (lineStart > view.viewport.to)
        return view.viewport.to == view.state.doc.length ? view.state.doc.length : -1;
    // Clip x to the viewport sides
    x = Math.max(content.left + 1, Math.min(content.right - 1, x));
    let root = view.root, element = root.elementFromPoint(x, y);
    // There's visible editor content under the point, so we can try
    // using caret(Position|Range)FromPoint as a shortcut
    let node, offset = -1;
    if (element && view.contentDOM.contains(element) && !(view.docView.nearest(element) instanceof WidgetView)) {
        if (root.caretPositionFromPoint) {
            let pos = root.caretPositionFromPoint(x, y);
            if (pos)
                ({ offsetNode: node, offset } = pos);
        }
        else if (root.caretRangeFromPoint) {
            let range = root.caretRangeFromPoint(x, y);
            if (range)
                ({ startContainer: node, startOffset: offset } = range);
        }
    }
    // No luck, do our own (potentially expensive) search
    if (!node) {
        let line = LineView.find(view.docView, lineStart);
        ({ node, offset } = domPosAtCoords(line.dom, x, y));
    }
    return view.docView.posFromDOM(node, offset);
}
function moveToLineBoundary(view, start, forward, includeWrap) {
    let line = view.state.doc.lineAt(start.head);
    let coords = !includeWrap || !view.lineWrapping ? null
        : view.coordsAtPos(start.assoc < 0 && start.head > line.start ? start.head - 1 : start.head);
    if (coords) {
        let editorRect = view.dom.getBoundingClientRect();
        let pos = view.posAtCoords({ x: forward == (view.textDirection == Direction.LTR) ? editorRect.right - 1 : editorRect.left + 1,
            y: (coords.top + coords.bottom) / 2 });
        if (pos > -1)
            return EditorSelection.cursor(pos, forward ? -1 : 1);
    }
    let lineView = LineView.find(view.docView, start.head);
    let end = lineView ? (forward ? lineView.posAtEnd : lineView.posAtStart) : (forward ? line.end : line.start);
    return EditorSelection.cursor(end, forward ? -1 : 1);
}
function moveByChar(view, start, forward, by) {
    let line = view.state.doc.lineAt(start.head), spans = view.bidiSpans(line);
    for (let cur = start, check = null;;) {
        let next = moveVisually(line, spans, view.textDirection, cur, forward), char = movedOver;
        if (!next) {
            if (line.number == (forward ? view.state.doc.lines : 1))
                return cur;
            char = "\n";
            line = view.state.doc.line(line.number + (forward ? 1 : -1));
            spans = view.bidiSpans(line);
            next = EditorSelection.cursor(forward ? line.start : line.end);
        }
        if (!check) {
            if (!by)
                return next;
            check = by(char);
        }
        else if (!check(char)) {
            return cur;
        }
        cur = next;
    }
}
function byGroup(view, pos, start) {
    let categorize = view.state.charCategorizer(pos);
    let cat = categorize(start);
    return (next) => {
        let nextCat = categorize(next);
        if (cat == CharCategory.Space)
            cat = nextCat;
        return cat == nextCat;
    };
}
function moveVertically(view, start, forward, distance) {
    var _a;
    let startPos = start.head, dir = forward ? 1 : -1;
    let startCoords = view.coordsAtPos(startPos);
    if (startCoords) {
        let rect = view.dom.getBoundingClientRect();
        let goal = (_a = start.goalColumn) !== null && _a !== void 0 ? _a : startCoords.left - rect.left;
        let resolvedGoal = rect.left + goal;
        let dist = distance !== null && distance !== void 0 ? distance : 5;
        for (let startY = dir < 0 ? startCoords.top : startCoords.bottom, extra = 0; extra < 50; extra += 10) {
            let pos = posAtCoords(view, { x: resolvedGoal, y: startY + (dist + extra) * dir }, dir);
            if (pos < 0)
                break;
            if (pos != startPos)
                return EditorSelection.cursor(pos, undefined, undefined, goal);
        }
    }
    // Outside of the drawn viewport, use a crude column-based approach
    let { doc } = view.state, line = doc.lineAt(startPos), tabSize = view.state.tabSize;
    let goal = start.goalColumn, goalCol = 0;
    if (goal == null) {
        for (const iter = doc.iterRange(line.start, startPos); !iter.next().done;)
            goalCol = countColumn(iter.value, goalCol, tabSize);
        goal = goalCol * view.defaultCharacterWidth;
    }
    else {
        goalCol = Math.round(goal / view.defaultCharacterWidth);
    }
    if (dir < 0 && line.start == 0)
        return EditorSelection.cursor(0, undefined, undefined, goal);
    else if (dir > 0 && line.end == doc.length)
        return EditorSelection.cursor(line.end, undefined, undefined, goal);
    let otherLine = doc.line(line.number + dir);
    let result = otherLine.start;
    let seen = 0;
    for (const iter = doc.iterRange(otherLine.start, otherLine.end); seen >= goalCol && !iter.next().done;) {
        const { offset, leftOver } = findColumn(iter.value, seen, goalCol, tabSize);
        seen = goalCol - leftOver;
        result += offset;
    }
    return EditorSelection.cursor(result, undefined, undefined, goal);
}

// This will also be where dragging info and such goes
class InputState {
    constructor(view) {
        this.lastKeyCode = 0;
        this.lastKeyTime = 0;
        this.lastSelectionOrigin = null;
        this.lastSelectionTime = 0;
        this.registeredEvents = [];
        this.customHandlers = [];
        this.composing = false;
        this.compositionEndedAt = 0;
        this.mouseSelection = null;
        for (let type in handlers) {
            let handler = handlers[type];
            view.contentDOM.addEventListener(type, (event) => {
                if (!eventBelongsToEditor(view, event) || this.ignoreDuringComposition(event))
                    return;
                if (this.runCustomHandlers(type, view, event))
                    event.preventDefault();
                else
                    handler(view, event);
            });
            this.registeredEvents.push(type);
        }
        // Must always run, even if a custom handler handled the event
        view.contentDOM.addEventListener("keydown", (event) => {
            view.inputState.lastKeyCode = event.keyCode;
            view.inputState.lastKeyTime = Date.now();
        });
        if (view.root.activeElement == view.contentDOM)
            view.dom.classList.add("cm-focused");
        this.notifiedFocused = view.hasFocus;
        this.ensureHandlers(view);
    }
    setSelectionOrigin(origin) {
        this.lastSelectionOrigin = origin;
        this.lastSelectionTime = Date.now();
    }
    ensureHandlers(view) {
        let handlers = this.customHandlers = view.pluginField(domEventHandlers);
        for (let set of handlers) {
            for (let type in set.handlers)
                if (this.registeredEvents.indexOf(type) < 0) {
                    this.registeredEvents.push(type);
                    (type != "scroll" ? view.contentDOM : view.scrollDOM).addEventListener(type, (event) => {
                        if (!eventBelongsToEditor(view, event))
                            return;
                        if (this.runCustomHandlers(type, view, event))
                            event.preventDefault();
                    });
                }
        }
    }
    runCustomHandlers(type, view, event) {
        for (let set of this.customHandlers) {
            let handler = set.handlers[type];
            if (handler) {
                try {
                    if (handler.call(set.plugin, event, view) || event.defaultPrevented)
                        return true;
                }
                catch (e) {
                    logException(view.state, e);
                }
            }
        }
        return false;
    }
    ignoreDuringComposition(event) {
        if (!/^key/.test(event.type))
            return false;
        if (this.composing)
            return true;
        // See https://www.stum.de/2016/06/24/handling-ime-events-in-javascript/.
        // On some input method editors (IMEs), the Enter key is used to
        // confirm character selection. On Safari, when Enter is pressed,
        // compositionend and keydown events are sometimes emitted in the
        // wrong order. The key event should still be ignored, even when
        // it happens after the compositionend event.
        if (browser.safari && event.timeStamp - this.compositionEndedAt < 500) {
            this.compositionEndedAt = 0;
            return true;
        }
        return false;
    }
    startMouseSelection(view, event, style) {
        if (this.mouseSelection)
            this.mouseSelection.destroy();
        this.mouseSelection = new MouseSelection(this, view, event, style);
    }
    update(update) {
        if (this.mouseSelection)
            this.mouseSelection.update(update);
        this.lastKeyCode = this.lastSelectionTime = 0;
    }
    destroy() {
        if (this.mouseSelection)
            this.mouseSelection.destroy();
    }
}
class MouseSelection {
    constructor(inputState, view, startEvent, style) {
        this.inputState = inputState;
        this.view = view;
        this.startEvent = startEvent;
        this.style = style;
        let doc = view.contentDOM.ownerDocument;
        doc.addEventListener("mousemove", this.move = this.move.bind(this));
        doc.addEventListener("mouseup", this.up = this.up.bind(this));
        this.extend = startEvent.shiftKey;
        this.multiple = view.state.facet(EditorState.allowMultipleSelections) && addsSelectionRange(view, startEvent);
        this.dragMove = dragMovesSelection$1(view, startEvent);
        this.dragging = isInPrimarySelection(view, startEvent) ? null : false;
        // When clicking outside of the selection, immediately apply the
        // effect of starting the selection
        if (this.dragging === false) {
            startEvent.preventDefault();
            this.select(startEvent);
        }
    }
    move(event) {
        if (event.buttons == 0)
            return this.destroy();
        if (this.dragging !== false)
            return;
        this.select(event);
    }
    up() {
        if (this.dragging == null)
            this.select(this.startEvent);
        this.destroy();
    }
    destroy() {
        let doc = this.view.contentDOM.ownerDocument;
        doc.removeEventListener("mousemove", this.move);
        doc.removeEventListener("mouseup", this.up);
        this.inputState.mouseSelection = null;
    }
    select(event) {
        let selection = this.style.get(event, this.extend, this.multiple);
        if (!selection.eq(this.view.state.selection) || selection.primary.assoc != this.view.state.selection.primary.assoc)
            this.view.dispatch(this.view.state.update({
                selection,
                annotations: Transaction.userEvent.of("pointerselection"),
                scrollIntoView: true
            }));
    }
    update(update) {
        if (update.docChanged && this.dragging)
            this.dragging = this.dragging.map(update.changes);
        this.style.update(update);
    }
}
function addsSelectionRange(view, event) {
    let facet = view.state.facet(clickAddsSelectionRange);
    return facet.length ? facet[0](event) : browser.mac ? event.metaKey : event.ctrlKey;
}
function dragMovesSelection$1(view, event) {
    let facet = view.state.facet(dragMovesSelection);
    return facet.length ? facet[0](event) : browser.mac ? !event.altKey : !event.ctrlKey;
}
function isInPrimarySelection(view, event) {
    let { primary } = view.state.selection;
    if (primary.empty)
        return false;
    // On boundary clicks, check whether the coordinates are inside the
    // selection's client rectangles
    let sel = getSelection(view.root);
    if (sel.rangeCount == 0)
        return true;
    let rects = sel.getRangeAt(0).getClientRects();
    for (let i = 0; i < rects.length; i++) {
        let rect = rects[i];
        if (rect.left <= event.clientX && rect.right >= event.clientX &&
            rect.top <= event.clientY && rect.bottom >= event.clientY)
            return true;
    }
    return false;
}
function eventBelongsToEditor(view, event) {
    if (!event.bubbles)
        return true;
    if (event.defaultPrevented)
        return false;
    for (let node = event.target, cView; node != view.contentDOM; node = node.parentNode)
        if (!node || node.nodeType == 11 || ((cView = ContentView.get(node)) && cView.ignoreEvent(event)))
            return false;
    return true;
}
const handlers = Object.create(null);
// This is very crude, but unfortunately both these browsers _pretend_
// that they have a clipboard API—all the objects and methods are
// there, they just don't work, and they are hard to test.
const brokenClipboardAPI = (browser.ie && browser.ie_version < 15) ||
    (browser.ios && browser.webkit_version < 604);
function capturePaste(view) {
    let parent = view.dom.parentNode;
    if (!parent)
        return;
    let target = parent.appendChild(document.createElement("textarea"));
    target.style.cssText = "position: fixed; left: -10000px; top: 10px";
    target.focus();
    setTimeout(() => {
        view.focus();
        target.remove();
        doPaste(view, target.value);
    }, 50);
}
function doPaste(view, input) {
    let text = view.state.toText(input), i = 1;
    let changes = text.lines == view.state.selection.ranges.length ?
        view.state.changeByRange(range => {
            let line = text.line(i++);
            return { changes: { from: range.from, to: range.to, insert: line.slice() },
                range: EditorSelection.cursor(range.from + line.length) };
        }) : view.state.replaceSelection(text);
    view.dispatch(view.state.update(changes, {
        annotations: Transaction.userEvent.of("paste"),
        scrollIntoView: true
    }));
}
function mustCapture(event) {
    let mods = (event.ctrlKey ? 1 /* Ctrl */ : 0) | (event.metaKey ? 8 /* Meta */ : 0) |
        (event.altKey ? 2 /* Alt */ : 0) | (event.shiftKey ? 4 /* Shift */ : 0);
    let code = event.keyCode, macCtrl = browser.mac && mods == 1 /* Ctrl */;
    return code == 8 || (macCtrl && code == 72) || // Backspace, Ctrl-h on Mac
        code == 46 || (macCtrl && code == 68) || // Delete, Ctrl-d on Mac
        code == 27 || // Esc
        (mods == (browser.mac ? 8 /* Meta */ : 1 /* Ctrl */) && // Ctrl/Cmd-[biyz]
            (code == 66 || code == 73 || code == 89 || code == 90));
}
handlers.keydown = (view, event) => {
    if (mustCapture(event))
        event.preventDefault();
    view.inputState.setSelectionOrigin("keyboardselection");
};
handlers.touchdown = handlers.touchmove = view => {
    view.inputState.setSelectionOrigin("pointerselection");
};
handlers.mousedown = (view, event) => {
    let style = null;
    for (let makeStyle of view.state.facet(mouseSelectionStyle)) {
        style = makeStyle(view, event);
        if (style)
            break;
    }
    if (!style && event.button == 0)
        style = basicMouseSelection(view, event);
    if (style) {
        focusPreventScroll(view.contentDOM);
        view.inputState.startMouseSelection(view, event, style);
    }
};
function rangeForClick(view, pos, bias, type) {
    if (type == 1) { // Single click
        return EditorSelection.cursor(pos, bias);
    }
    else if (type == 2) { // Double click
        return groupAt(view.state, pos, bias);
    }
    else { // Triple click
        let line = LineView.find(view.docView, pos);
        if (line)
            return EditorSelection.range(line.posAtStart, line.posAtEnd);
        let { start, end } = view.state.doc.lineAt(pos);
        return EditorSelection.range(start, end);
    }
}
let insideY = (y, rect) => y >= rect.top && y <= rect.bottom;
let inside = (x, y, rect) => insideY(y, rect) && x >= rect.left && x <= rect.right;
// Try to determine, for the given coordinates, associated with the
// given position, whether they are related to the element before or
// the element after the position.
function findPositionSide(view, pos, x, y) {
    let line = LineView.find(view.docView, pos);
    if (!line)
        return 1;
    let off = pos - line.posAtStart;
    // Line boundaries point into the line
    if (off == 0)
        return 1;
    if (off == line.length)
        return -1;
    // Positions on top of an element point at that element
    let before = line.coordsAt(off, -1);
    if (before && inside(x, y, before))
        return -1;
    let after = line.coordsAt(off, 1);
    if (after && inside(x, y, after))
        return 1;
    // This is probably a line wrap point. Pick before if the point is
    // beside it.
    return before && insideY(y, before) ? -1 : 1;
}
function queryPos(view, event) {
    let pos = view.posAtCoords({ x: event.clientX, y: event.clientY });
    if (pos < 0)
        return null;
    return { pos, bias: findPositionSide(view, pos, event.clientX, event.clientY) };
}
function basicMouseSelection(view, event) {
    let start = queryPos(view, event), type = event.detail;
    let startSel = view.state.selection;
    return {
        update(update) {
            if (update.changes) {
                if (start)
                    start.pos = update.changes.mapPos(start.pos);
                startSel = startSel.map(update.changes);
            }
        },
        get(event, extend, multiple) {
            let cur = queryPos(view, event);
            if (!cur || !start)
                return startSel;
            let range = rangeForClick(view, cur.pos, cur.bias, type);
            if (start.pos != cur.pos && !extend) {
                let startRange = rangeForClick(view, start.pos, start.bias, type);
                let from = Math.min(startRange.from, range.from), to = Math.max(startRange.to, range.to);
                range = from < range.from ? EditorSelection.range(from, to) : EditorSelection.range(to, from);
            }
            if (extend)
                return startSel.replaceRange(startSel.primary.extend(range.from, range.to));
            else if (multiple)
                return startSel.addRange(range);
            else
                return EditorSelection.create([range]);
        }
    };
}
handlers.dragstart = (view, event) => {
    let { selection: { primary } } = view.state;
    let { mouseSelection } = view.inputState;
    if (mouseSelection)
        mouseSelection.dragging = primary;
    if (event.dataTransfer) {
        event.dataTransfer.setData("Text", view.state.sliceDoc(primary.from, primary.to));
        event.dataTransfer.effectAllowed = "copyMove";
    }
};
handlers.drop = (view, event) => {
    if (!event.dataTransfer)
        return;
    let dropPos = view.posAtCoords({ x: event.clientX, y: event.clientY });
    let text = event.dataTransfer.getData("Text");
    if (dropPos < 0 || !text)
        return;
    event.preventDefault();
    let { mouseSelection } = view.inputState;
    let del = mouseSelection && mouseSelection.dragging && mouseSelection.dragMove ?
        { from: mouseSelection.dragging.from, to: mouseSelection.dragging.to } : null;
    let ins = { from: dropPos, insert: text };
    let changes = view.state.changes(del ? [del, ins] : ins);
    view.focus();
    view.dispatch(view.state.update({
        changes,
        selection: { anchor: changes.mapPos(dropPos, -1), head: changes.mapPos(dropPos, 1) },
        annotations: Transaction.userEvent.of("drop")
    }));
};
handlers.paste = (view, event) => {
    view.observer.flush();
    let data = brokenClipboardAPI ? null : event.clipboardData;
    let text = data && data.getData("text/plain");
    if (text) {
        doPaste(view, text);
        event.preventDefault();
    }
    else {
        capturePaste(view);
    }
};
function captureCopy(view, text) {
    // The extra wrapper is somehow necessary on IE/Edge to prevent the
    // content from being mangled when it is put onto the clipboard
    let parent = view.dom.parentNode;
    if (!parent)
        return;
    let target = parent.appendChild(document.createElement("textarea"));
    target.style.cssText = "position: fixed; left: -10000px; top: 10px";
    target.value = text;
    target.focus();
    target.selectionEnd = text.length;
    target.selectionStart = 0;
    setTimeout(() => {
        target.remove();
        view.focus();
    }, 50);
}
function copiedRange(state) {
    let content = [], ranges = [];
    for (let range of state.selection.ranges)
        if (!range.empty) {
            content.push(state.sliceDoc(range.from, range.to));
            ranges.push(range);
        }
    if (!content.length) {
        // Nothing selected, do a line-wise copy
        let upto = -1;
        for (let { from } of state.selection.ranges) {
            let line = state.doc.lineAt(from);
            if (line.number > upto) {
                content.push(line.slice());
                ranges.push({ from: line.start, to: Math.min(state.doc.length, line.end + 1) });
            }
            upto = line.number;
        }
    }
    return { text: content.join(state.lineBreak), ranges };
}
handlers.copy = handlers.cut = (view, event) => {
    let { text, ranges } = copiedRange(view.state);
    if (!text)
        return;
    let data = brokenClipboardAPI ? null : event.clipboardData;
    if (data) {
        event.preventDefault();
        data.clearData();
        data.setData("text/plain", text);
    }
    else {
        captureCopy(view, text);
    }
    if (event.type == "cut")
        view.dispatch(view.state.update({
            changes: ranges,
            scrollIntoView: true,
            annotations: Transaction.userEvent.of("cut")
        }));
};
handlers.focus = handlers.blur = view => {
    setTimeout(() => {
        if (view.hasFocus != view.inputState.notifiedFocused)
            view.update([]);
    }, 10);
};
handlers.beforeprint = view => {
    view.viewState.printing = true;
    view.requestMeasure();
    setTimeout(() => {
        view.viewState.printing = false;
        view.requestMeasure();
    }, 2000);
};
function forceClearComposition(view) {
    if (view.docView.compositionDeco.size)
        view.update([]);
}
handlers.compositionstart = handlers.compositionupdate = view => {
    if (!view.inputState.composing) {
        if (view.docView.compositionDeco.size) {
            view.observer.flush();
            forceClearComposition(view);
        }
        // FIXME possibly set a timeout to clear it again on Android
        view.inputState.composing = true;
    }
};
handlers.compositionend = view => {
    view.inputState.composing = false;
    view.inputState.compositionEndedAt = Date.now();
    setTimeout(() => {
        if (!view.inputState.composing)
            forceClearComposition(view);
    }, 50);
};

const observeOptions = {
    childList: true,
    characterData: true,
    subtree: true,
    characterDataOldValue: true
};
// IE11 has very broken mutation observers, so we also listen to
// DOMCharacterDataModified there
const useCharData = browser.ie && browser.ie_version <= 11;
class DOMObserver {
    constructor(view, onChange, onScrollChanged) {
        this.view = view;
        this.onChange = onChange;
        this.onScrollChanged = onScrollChanged;
        this.active = false;
        this.ignoreSelection = new DOMSelection;
        this.charDataQueue = [];
        this.charDataTimeout = null;
        this.scrollTargets = [];
        this.intersection = null;
        this.intersecting = false;
        // Timeout for scheduling check of the parents that need scroll handlers
        this.parentCheck = -1;
        this.dom = view.contentDOM;
        this.observer = new MutationObserver(mutations => this.flush(mutations));
        if (useCharData)
            this.onCharData = (event) => {
                this.charDataQueue.push({ target: event.target,
                    type: "characterData",
                    oldValue: event.prevValue });
                if (this.charDataTimeout == null)
                    this.charDataTimeout = setTimeout(() => this.flush(), 20);
            };
        this.onSelectionChange = () => {
            if (this.view.root.activeElement == this.dom)
                this.flush();
        };
        this.start();
        this.onScroll = this.onScroll.bind(this);
        window.addEventListener("scroll", this.onScroll);
        if (typeof IntersectionObserver == "function") {
            this.intersection = new IntersectionObserver(entries => {
                if (this.parentCheck < 0)
                    this.parentCheck = setTimeout(this.listenForScroll.bind(this), 1000);
                if (entries[entries.length - 1].intersectionRatio > 0 != this.intersecting) {
                    this.intersecting = !this.intersecting;
                    this.onScroll();
                }
            }, {});
            this.intersection.observe(this.dom);
        }
        this.listenForScroll();
    }
    onScroll() {
        if (this.intersecting) {
            this.flush();
            this.onScrollChanged();
        }
    }
    listenForScroll() {
        this.parentCheck = -1;
        let i = 0, changed = null;
        for (let dom = this.dom; dom;) {
            if (dom.nodeType == 1) {
                if (!changed && i < this.scrollTargets.length && this.scrollTargets[i] == dom)
                    i++;
                else if (!changed)
                    changed = this.scrollTargets.slice(0, i);
                if (changed)
                    changed.push(dom);
                dom = dom.parentNode;
            }
            else if (dom.nodeType == 11) { // Shadow root
                dom = dom.host;
            }
            else {
                break;
            }
        }
        if (i < this.scrollTargets.length && !changed)
            changed = this.scrollTargets.slice(0, i);
        if (changed) {
            for (let dom of this.scrollTargets)
                dom.removeEventListener("scroll", this.onScroll);
            for (let dom of this.scrollTargets = changed)
                dom.addEventListener("scroll", this.onScroll);
        }
    }
    ignore(f) {
        if (!this.active)
            return f();
        try {
            this.stop();
            return f();
        }
        finally {
            this.start();
            this.clear();
        }
    }
    start() {
        if (this.active)
            return;
        this.observer.observe(this.dom, observeOptions);
        // FIXME is this shadow-root safe?
        this.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
        if (useCharData)
            this.dom.addEventListener("DOMCharacterDataModified", this.onCharData);
        this.active = true;
    }
    stop() {
        if (!this.active)
            return;
        this.active = false;
        this.observer.disconnect();
        this.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
        if (useCharData)
            this.dom.removeEventListener("DOMCharacterDataModified", this.onCharData);
    }
    takeCharRecords() {
        let result = this.charDataQueue;
        if (result.length) {
            this.charDataQueue = [];
            clearTimeout(this.charDataTimeout);
            this.charDataTimeout = null;
        }
        return result;
    }
    clearSelection() {
        this.ignoreSelection.set(getSelection(this.view.root));
    }
    // Throw away any pending changes
    clear() {
        this.observer.takeRecords();
        this.takeCharRecords();
        this.clearSelection();
    }
    // Apply pending changes, if any
    flush(records = this.observer.takeRecords()) {
        if (this.charDataQueue.length)
            records = records.concat(this.takeCharRecords());
        let selection = getSelection(this.view.root);
        let newSel = !this.ignoreSelection.eq(selection) && hasSelection(this.dom, selection);
        if (records.length == 0 && !newSel)
            return;
        let from = -1, to = -1, typeOver = false;
        for (let record of records) {
            let range = this.readMutation(record);
            if (!range)
                continue;
            if (range.typeOver)
                typeOver = true;
            if (from == -1) {
                ({ from, to } = range);
            }
            else {
                from = Math.min(range.from, from);
                to = Math.max(range.to, to);
            }
        }
        let apply = from > -1 || newSel;
        if (!apply || !this.onChange(from, to, typeOver)) {
            if (this.view.docView.dirty) {
                this.ignore(() => this.view.docView.sync());
                this.view.docView.dirty = 0 /* Not */;
            }
            this.view.docView.updateSelection();
        }
        this.clearSelection();
    }
    readMutation(rec) {
        let cView = this.view.docView.nearest(rec.target);
        if (!cView || cView.ignoreMutation(rec))
            return null;
        cView.markDirty();
        if (rec.type == "childList") {
            let childBefore = findChild(cView, rec.previousSibling || rec.target.previousSibling, -1);
            let childAfter = findChild(cView, rec.nextSibling || rec.target.nextSibling, 1);
            return { from: childBefore ? cView.posAfter(childBefore) : cView.posAtStart,
                to: childAfter ? cView.posBefore(childAfter) : cView.posAtEnd, typeOver: false };
        }
        else { // "characterData"
            return { from: cView.posAtStart, to: cView.posAtEnd, typeOver: rec.target.nodeValue == rec.oldValue };
        }
    }
    destroy() {
        this.stop();
        if (this.intersection)
            this.intersection.disconnect();
        for (let dom of this.scrollTargets)
            dom.removeEventListener("scroll", this.onScroll);
        window.removeEventListener("scroll", this.onScroll);
        clearTimeout(this.parentCheck);
    }
}
function findChild(cView, dom, dir) {
    while (dom) {
        let curView = ContentView.get(dom);
        if (curView && curView.parent == cView)
            return curView;
        let parent = dom.parentNode;
        dom = parent != cView.dom ? parent : dir > 0 ? dom.nextSibling : dom.previousSibling;
    }
    return null;
}

// FIXME reconsider this kludge (does it break reading dom text with newlines?)
const LineSep = "\ufdda"; // A Unicode 'non-character', used to denote newlines internally
function applyDOMChange(view, start, end, typeOver) {
    let change, newSel;
    let sel = view.state.selection.primary, bounds;
    if (start > -1 && (bounds = view.docView.domBoundsAround(start, end, 0))) {
        let { from, to } = bounds;
        let selPoints = view.docView.impreciseHead || view.docView.impreciseAnchor ? [] : selectionPoints(view.contentDOM, view.root);
        let reader = new DOMReader(selPoints);
        reader.readRange(bounds.startDOM, bounds.endDOM);
        newSel = selectionFromPoints(selPoints, from);
        let preferredPos = sel.from, preferredSide = null;
        // Prefer anchoring to end when Backspace is pressed
        if (view.inputState.lastKeyCode === 8 && view.inputState.lastKeyTime > Date.now() - 100) {
            preferredPos = sel.to;
            preferredSide = "end";
        }
        let diff = findDiff(view.state.doc.sliceString(from, to, LineSep), reader.text, preferredPos - from, preferredSide);
        if (diff)
            change = { from: from + diff.from, to: from + diff.toA,
                insert: Text.of(reader.text.slice(diff.from, diff.toB).split(LineSep)) };
    }
    else if (view.hasFocus) {
        let domSel = getSelection(view.root);
        let { impreciseHead: iHead, impreciseAnchor: iAnchor } = view.docView;
        let head = iHead && iHead.node == domSel.focusNode && iHead.offset == domSel.focusOffset ? view.state.selection.primary.head
            : view.docView.posFromDOM(domSel.focusNode, domSel.focusOffset);
        let anchor = iAnchor && iAnchor.node == domSel.anchorNode && iAnchor.offset == domSel.anchorOffset
            ? view.state.selection.primary.anchor
            : selectionCollapsed(domSel) ? head : view.docView.posFromDOM(domSel.anchorNode, domSel.anchorOffset);
        if (head != sel.head || anchor != sel.anchor)
            newSel = EditorSelection.single(anchor, head);
    }
    if (!change && !newSel)
        return false;
    // Heuristic to notice typing over a selected character
    if (!change && typeOver && !sel.empty && newSel && newSel.primary.empty)
        change = { from: sel.from, to: sel.to, insert: view.state.doc.slice(sel.from, sel.to) };
    if (change) {
        let startState = view.state;
        // Android browsers don't fire reasonable key events for enter,
        // backspace, or delete. So this detects changes that look like
        // they're caused by those keys, and reinterprets them as key
        // events.
        if (browser.android &&
            ((change.from == sel.from && change.to == sel.to &&
                change.insert.length == 1 && change.insert.lines == 2 &&
                dispatchKey(view, "Enter", 10)) ||
                (change.from == sel.from - 1 && change.to == sel.to && change.insert.length == 0 &&
                    dispatchKey(view, "Backspace", 8)) ||
                (change.from == sel.from && change.to == sel.to + 1 && change.insert.length == 0 &&
                    dispatchKey(view, "Delete", 46))))
            return view.state != startState;
        let tr;
        if (change.from >= sel.from && change.to <= sel.to && change.to - change.from >= (sel.to - sel.from) / 3) {
            let before = sel.from < change.from ? startState.doc.sliceString(sel.from, change.from, LineSep) : "";
            let after = sel.to > change.to ? startState.doc.sliceString(change.to, sel.to, LineSep) : "";
            tr = startState.replaceSelection(Text.of((before + change.insert.sliceString(0, undefined, LineSep) + after).split(LineSep)));
        }
        else {
            let changes = startState.changes(change);
            tr = {
                changes,
                selection: newSel && !startState.selection.primary.eq(newSel.primary) && newSel.primary.to <= changes.newLength
                    ? startState.selection.replaceRange(newSel.primary) : undefined
            };
        }
        view.dispatch(startState.update(tr, { scrollIntoView: true, annotations: Transaction.userEvent.of("input") }));
        return true;
    }
    else if (newSel && !newSel.primary.eq(sel)) {
        let scrollIntoView = false, annotations;
        if (view.inputState.lastSelectionTime > Date.now() - 50) {
            if (view.inputState.lastSelectionOrigin == "keyboardselection")
                scrollIntoView = true;
            else
                annotations = Transaction.userEvent.of(view.inputState.lastSelectionOrigin);
        }
        view.dispatch(view.state.update({ selection: newSel, scrollIntoView, annotations }));
        return true;
    }
    return false;
}
function findDiff(a, b, preferredPos, preferredSide) {
    let minLen = Math.min(a.length, b.length);
    let from = 0;
    while (from < minLen && a.charCodeAt(from) == b.charCodeAt(from))
        from++;
    if (from == minLen && a.length == b.length)
        return null;
    let toA = a.length, toB = b.length;
    while (toA > 0 && toB > 0 && a.charCodeAt(toA - 1) == b.charCodeAt(toB - 1)) {
        toA--;
        toB--;
    }
    if (preferredSide == "end") {
        let adjust = Math.max(0, from - Math.min(toA, toB));
        preferredPos -= toA + adjust - from;
    }
    if (toA < from && a.length < b.length) {
        let move = preferredPos <= from && preferredPos >= toA ? from - preferredPos : 0;
        from -= move;
        toB = from + (toB - toA);
        toA = from;
    }
    else if (toB < from) {
        let move = preferredPos <= from && preferredPos >= toB ? from - preferredPos : 0;
        from -= move;
        toA = from + (toA - toB);
        toB = from;
    }
    return { from, toA, toB };
}
class DOMReader {
    constructor(points) {
        this.points = points;
        this.text = "";
    }
    readRange(start, end) {
        if (!start)
            return;
        let parent = start.parentNode;
        for (let cur = start;;) {
            this.findPointBefore(parent, cur);
            this.readNode(cur);
            let next = cur.nextSibling;
            if (next == end)
                break;
            let view = ContentView.get(cur), nextView = ContentView.get(next);
            if ((view ? view.breakAfter : isBlockElement(cur)) ||
                ((nextView ? nextView.breakAfter : isBlockElement(next)) && !(cur.nodeName == "BR" && !cur.cmIgnore)))
                this.text += LineSep;
            cur = next;
        }
        this.findPointBefore(parent, end);
    }
    readNode(node) {
        if (node.cmIgnore)
            return;
        let view = ContentView.get(node);
        let fromView = view && view.overrideDOMText;
        let text;
        if (fromView != null)
            text = fromView.sliceString(0, undefined, LineSep);
        else if (node.nodeType == 3)
            text = node.nodeValue;
        else if (node.nodeName == "BR")
            text = node.nextSibling ? LineSep : "";
        else if (node.nodeType == 1)
            this.readRange(node.firstChild, null);
        if (text != null) {
            this.findPointIn(node, text.length);
            this.text += text;
        }
    }
    findPointBefore(node, next) {
        for (let point of this.points)
            if (point.node == node && node.childNodes[point.offset] == next)
                point.pos = this.text.length;
    }
    findPointIn(node, maxLen) {
        for (let point of this.points)
            if (point.node == node)
                point.pos = this.text.length + Math.min(point.offset, maxLen);
    }
}
function isBlockElement(node) {
    return node.nodeType == 1 && /^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(node.nodeName);
}
class DOMPoint {
    constructor(node, offset) {
        this.node = node;
        this.offset = offset;
        this.pos = -1;
    }
}
function selectionPoints(dom, root) {
    let result = [];
    if (root.activeElement != dom)
        return result;
    let { anchorNode, anchorOffset, focusNode, focusOffset } = getSelection(root);
    if (anchorNode) {
        result.push(new DOMPoint(anchorNode, anchorOffset));
        if (focusNode != anchorNode || focusOffset != anchorOffset)
            result.push(new DOMPoint(focusNode, focusOffset));
    }
    return result;
}
function selectionFromPoints(points, base) {
    if (points.length == 0)
        return null;
    let anchor = points[0].pos, head = points.length == 2 ? points[1].pos : anchor;
    return anchor > -1 && head > -1 ? EditorSelection.single(anchor + base, head + base) : null;
}
function dispatchKey(view, name, code) {
    let options = { key: name, code: name, keyCode: code, which: code, cancelable: true };
    let down = new KeyboardEvent("keydown", options);
    view.contentDOM.dispatchEvent(down);
    let up = new KeyboardEvent("keyup", options);
    view.contentDOM.dispatchEvent(up);
    return down.defaultPrevented || up.defaultPrevented;
}

// The editor's update state machine looks something like this:
//
//     Idle → Updating ⇆ Idle (unchecked) → Measuring → Idle
//                                         ↑      ↓
//                                         Updating (measure)
//
// The difference between 'Idle' and 'Idle (unchecked)' lies in
// whether a layout check has been scheduled. A regular update through
// the `update` method updates the DOM in a write-only fashion, and
// relies on a check (scheduled with `requestAnimationFrame`) to make
// sure everything is where it should be and the viewport covers the
// visible code. That check continues to measure and then optionally
// update until it reaches a coherent state.
/// An editor view represents the editor's user interface. It holds
/// the editable DOM surface, and possibly other elements such as the
/// line number gutter. It handles events and dispatches state
/// transactions for editing actions.
class EditorView {
    /// Construct a new view. You'll usually want to put `view.dom` into
    /// your document after creating a view, so that the user can see
    /// it.
    constructor(
    /// Configuration options.
    config = {}) {
        this.plugins = [];
        this.editorAttrs = {};
        this.contentAttrs = {};
        this.bidiCache = [];
        /// @internal
        this.updateState = 2 /* Updating */;
        /// @internal
        this.measureScheduled = -1;
        /// @internal
        this.measureRequests = [];
        this.contentDOM = document.createElement("div");
        this.scrollDOM = document.createElement("div");
        this.scrollDOM.className = themeClass("scroller");
        this.scrollDOM.appendChild(this.contentDOM);
        this.dom = document.createElement("div");
        this.dom.appendChild(this.scrollDOM);
        this.dispatch = config.dispatch || ((tr) => this.update([tr]));
        this.root = (config.root || document);
        this.viewState = new ViewState(config.state || EditorState.create());
        this.plugins = this.state.facet(viewPlugin).map(spec => PluginInstance.create(spec, this));
        this.observer = new DOMObserver(this, (from, to, typeOver) => applyDOMChange(this, from, to, typeOver), () => this.measure());
        this.docView = new DocView(this);
        this.inputState = new InputState(this);
        this.mountStyles();
        this.updateAttrs();
        this.updateState = 0 /* Idle */;
        ensureGlobalHandler();
        this.requestMeasure();
        if (config.parent)
            config.parent.appendChild(this.dom);
    }
    /// The current editor state.
    get state() { return this.viewState.state; }
    /// To be able to display large documents without consuming too much
    /// memory or overloading the browser, CodeMirror only draws the
    /// code that is visible (plus a margin around it) to the DOM. This
    /// property tells you the extent of the current drawn viewport, in
    /// document positions.
    get viewport() { return this.viewState.viewport; }
    /// When there are, for example, large collapsed ranges in the
    /// viewport, its size can be a lot bigger than the actual visible
    /// content. Thus, if you are doing something like styling the
    /// content in the viewport, it is preferable to only do so for
    /// these ranges, which are the subset of the viewport that is
    /// actually drawn.
    get visibleRanges() { return this.viewState.visibleRanges; }
    /// Update the view for the given array of transactions. This will
    /// update the visible document and selection to match the state
    /// produced by the transactions, and notify view plugins of the
    /// change.
    update(transactions) {
        if (this.updateState != 0 /* Idle */)
            throw new Error("Calls to EditorView.update are not allowed while an update is in progress");
        this.updateState = 2 /* Updating */;
        let state = this.state;
        for (let tr of transactions) {
            if (tr.startState != state)
                throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");
            state = tr.state;
        }
        let update = new ViewUpdate(this, state, transactions);
        let scrollTo = transactions.some(tr => tr.scrolledIntoView) ? state.selection.primary : null;
        this.viewState.update(update, scrollTo);
        this.bidiCache = CachedOrder.update(this.bidiCache, update.changes);
        if (!update.empty)
            this.updatePlugins(update);
        let redrawn = this.docView.update(update);
        if (this.state.facet(styleModule) != this.styleModules)
            this.mountStyles();
        this.updateAttrs();
        this.updateState = 0 /* Idle */;
        if (redrawn || scrollTo || this.viewState.mustEnforceCursorAssoc)
            this.requestMeasure();
    }
    updatePlugins(update) {
        let prevSpecs = update.prevState.facet(viewPlugin), specs = update.state.facet(viewPlugin);
        if (prevSpecs != specs) {
            let newPlugins = [], reused = [];
            for (let spec of specs) {
                let found = prevSpecs.indexOf(spec);
                if (found < 0) {
                    newPlugins.push(PluginInstance.create(spec, this));
                }
                else {
                    let plugin = this.plugins[found].update(update);
                    reused.push(plugin);
                    newPlugins.push(plugin);
                }
            }
            for (let plugin of this.plugins)
                if (reused.indexOf(plugin) < 0)
                    plugin.destroy(this);
            this.plugins = newPlugins;
            this.inputState.ensureHandlers(this);
        }
        else {
            for (let i = 0; i < this.plugins.length; i++)
                this.plugins[i] = this.plugins[i].update(update);
        }
    }
    /// @internal
    measure() {
        if (this.measureScheduled > -1)
            cancelAnimationFrame(this.measureScheduled);
        this.measureScheduled = 1; // Prevent requestMeasure calls from scheduling another animation frame
        for (let i = 0;; i++) {
            this.updateState = 1 /* Measuring */;
            let changed = this.viewState.measure(this.docView, i > 0);
            let measuring = this.measureRequests;
            if (!changed && !measuring.length && this.viewState.scrollTo == null)
                break;
            this.measureRequests = [];
            if (i > 5) {
                console.warn("Viewport failed to stabilize");
                break;
            }
            let measured = measuring.map(m => {
                try {
                    return m.read(this);
                }
                catch (e) {
                    logException(this.state, e);
                    return BadMeasure;
                }
            });
            let update = new ViewUpdate(this, this.state);
            update.flags |= changed;
            this.updateState = 2 /* Updating */;
            this.updatePlugins(update);
            if (changed)
                this.docView.update(update);
            for (let i = 0; i < measuring.length; i++)
                if (measured[i] != BadMeasure) {
                    try {
                        measuring[i].write(measured[i], this);
                    }
                    catch (e) {
                        logException(this.state, e);
                    }
                }
            if (this.viewState.scrollTo) {
                this.docView.scrollPosIntoView(this.viewState.scrollTo.head, this.viewState.scrollTo.assoc);
                this.viewState.scrollTo = null;
            }
            if (!(changed & 4 /* Viewport */) && this.measureRequests.length == 0)
                break;
        }
        this.updateState = 0 /* Idle */;
        this.measureScheduled = -1;
    }
    /// Get the CSS classes for the currently active editor themes.
    get themeClasses() {
        return baseThemeID + " " +
            (this.state.facet(darkTheme) ? baseDarkThemeID : baseLightThemeID) + " " +
            this.state.facet(theme).join(" ");
    }
    updateAttrs() {
        let editorAttrs = combineAttrs(this.state.facet(editorAttributes), {
            class: themeClass("wrap") + (this.hasFocus ? " cm-focused " : " ") + this.themeClasses
        });
        updateAttrs(this.dom, this.editorAttrs, editorAttrs);
        this.editorAttrs = editorAttrs;
        let contentAttrs = combineAttrs(this.state.facet(contentAttributes), {
            spellcheck: "false",
            contenteditable: String(this.state.facet(editable)),
            class: themeClass("content"),
            style: `${browser.tabSize}: ${this.state.tabSize}`,
            role: "textbox",
            "aria-multiline": "true"
        });
        updateAttrs(this.contentDOM, this.contentAttrs, contentAttrs);
        this.contentAttrs = contentAttrs;
    }
    mountStyles() {
        this.styleModules = this.state.facet(styleModule);
        StyleModule.mount(this.root, this.styleModules.concat(baseTheme).reverse());
    }
    /// Find the DOM parent node and offset (child offset if `node` is
    /// an element, character offset when it is a text node) at the
    /// given document position.
    domAtPos(pos) {
        return this.docView.domAtPos(pos);
    }
    /// Find the document position at the given DOM node. Can be useful
    /// for associating positions with DOM events. Will raise an error
    /// when `node` isn't part of the editor content.
    posAtDOM(node, offset = 0) {
        return this.docView.posFromDOM(node, offset);
    }
    readMeasured() {
        if (this.updateState == 2 /* Updating */)
            throw new Error("Reading the editor layout isn't allowed during an update");
        if (this.updateState == 0 /* Idle */ && this.measureScheduled > -1)
            this.measure();
    }
    /// Make sure plugins get a chance to measure the DOM before the
    /// next frame. Calling this is preferable to messing with the DOM
    /// directly from, for example, an even handler, because it'll make
    /// sure measuring and drawing done by other components is
    /// synchronized, avoiding unnecessary DOM layout computations.
    requestMeasure(request) {
        if (this.measureScheduled < 0)
            this.measureScheduled = requestAnimationFrame(() => this.measure());
        if (request) {
            if (request.key != null)
                for (let i = 0; i < this.measureRequests.length; i++) {
                    if (this.measureRequests[i].key === request.key) {
                        this.measureRequests[i] = request;
                        return;
                    }
                }
            this.measureRequests.push(request);
        }
    }
    /// Collect all values provided by the active plugins for a given
    /// field.
    pluginField(field) {
        // FIXME make this error when called during plugin updating
        let result = [];
        for (let plugin of this.plugins)
            plugin.takeField(field, result);
        return result;
    }
    /// Get the value of a specific plugin, if present. Note that
    /// plugins that crash can be dropped from a view, so even when you
    /// know you registered a given plugin, it is recommended to check
    /// the return value of this method.
    plugin(plugin) {
        for (let inst of this.plugins)
            if (inst.spec == plugin)
                return inst.value;
        return null;
    }
    /// Find the line or block widget at the given vertical position.
    /// `editorTop`, if given, provides the vertical position of the top
    /// of the editor. It defaults to the editor's screen position
    /// (which will force a DOM layout).
    blockAtHeight(height, editorTop) {
        this.readMeasured();
        return this.viewState.blockAtHeight(height, ensureTop(editorTop, this.contentDOM));
    }
    /// Find information for the line at the given vertical position.
    /// The resulting block info might hold another array of block info
    /// structs in its `type` field if this line consists of more than
    /// one block.
    lineAtHeight(height, editorTop) {
        this.readMeasured();
        return this.viewState.lineAtHeight(height, ensureTop(editorTop, this.contentDOM));
    }
    /// Find the height information for the given line.
    lineAt(pos, editorTop) {
        // FIXME separate line (extent, bidi, widgets) info from height queries
        if (editorTop == null)
            this.readMeasured();
        return this.viewState.lineAt(pos, ensureTop(editorTop, this.contentDOM));
    }
    /// Iterate over the height information of the lines in the
    /// viewport.
    viewportLines(f, editorTop) {
        let { from, to } = this.viewport;
        this.viewState.forEachLine(from, to, f, ensureTop(editorTop, this.contentDOM));
    }
    /// The editor's total content height.
    get contentHeight() {
        return this.viewState.heightMap.height + this.viewState.paddingTop + this.viewState.paddingBottom;
    }
    /// Move a cursor position by [grapheme
    /// cluster](#text.nextClusterBreak). `forward` determines whether
    /// the motion is away from the line start, or towards it. Motion in
    /// bidirectional text is in visual order, in the editor's [text
    /// direction](#view.EditorView.textDirection). When the start
    /// position was the last one on the line, the returned position
    /// will be across the line break. If there is no further line, the
    /// original position is returned.
    moveByChar(start, forward, by) {
        return moveByChar(this, start, forward, by);
    }
    /// Move a cursor position across the next group of either
    /// [letters](#state.EditorState.charCategorizer) or non-letter
    /// non-whitespace characters.
    moveByGroup(start, forward) {
        return moveByChar(this, start, forward, initial => byGroup(this, start.head, initial));
    }
    /// Move to the next line boundary in the given direction. If
    /// `includeWrap` is true, line wrapping is on, and there is a
    /// further wrap point on the current line, the wrap point will be
    /// returned. Otherwise this function will return the start or end
    /// of the line.
    moveToLineBoundary(start, forward, includeWrap = true) {
        return moveToLineBoundary(this, start, forward, includeWrap);
    }
    /// Move a cursor position vertically. When `distance` isn't given,
    /// it defaults to moving to the next line (including wrapped
    /// lines). Otherwise, `distance` should provide a positive distance
    /// in pixels.
    ///
    /// When `start` has a
    /// [`goalColumn`](#state.SelectionRange.goalColumn), the vertical
    /// motion will use that as a target horizontal position. Otherwise,
    /// the cursor's own horizontal position is used. The returned
    /// cursor will have its goal column set to whichever column was
    /// used.
    moveVertically(start, forward, distance) {
        return moveVertically(this, start, forward, distance);
    }
    /// Scroll the given document position into view.
    scrollPosIntoView(pos) {
        this.viewState.scrollTo = EditorSelection.cursor(pos);
        this.requestMeasure();
    }
    /// Get the document position at the given screen coordinates.
    /// Returns -1 if no valid position could be found.
    posAtCoords(coords) {
        this.readMeasured();
        return posAtCoords(this, coords);
    }
    /// Get the screen coordinates at the given document position.
    coordsAtPos(pos, side = 1) {
        this.readMeasured();
        let rect = this.docView.coordsAt(pos, side);
        if (!rect || rect.left == rect.right)
            return rect;
        let line = this.state.doc.lineAt(pos), order = this.bidiSpans(line);
        let span = order[BidiSpan.find(order, pos - line.start, -1, side)];
        let x = (span.dir == Direction.LTR) == (side < 0) ? rect.right : rect.left;
        return { left: x, right: x, top: rect.top, bottom: rect.bottom };
    }
    /// The default width of a character in the editor. May not
    /// accurately reflect the width of all characters.
    get defaultCharacterWidth() { return this.viewState.heightOracle.charWidth; }
    /// The default height of a line in the editor.
    get defaultLineHeight() { return this.viewState.heightOracle.lineHeight; }
    /// The text direction (`direction` CSS property) of the editor.
    get textDirection() { return this.viewState.heightOracle.direction; }
    /// Whether this editor [wraps lines](#view.EditorView.lineWrapping)
    /// (as determined by the `white-space` CSS property of its content
    /// element).
    get lineWrapping() { return this.viewState.heightOracle.lineWrapping; }
    /// Returns the bidirectional text structure of the given line
    /// (which should be in the current document) as an array of span
    /// objects. The order of these spans matches the [text
    /// direction](#view.EditorView.textDirection)—if that is
    /// left-to-right, the leftmost spans come first, otherwise the
    /// rightmost spans come first.
    bidiSpans(line) {
        if (line.length > MaxBidiLine)
            return trivialOrder(line.length);
        let dir = this.textDirection;
        for (let entry of this.bidiCache)
            if (entry.from == line.start && entry.dir == dir)
                return entry.order;
        let order = computeOrder(line.slice(), this.textDirection);
        this.bidiCache.push(new CachedOrder(line.start, line.end, dir, order));
        return order;
    }
    /// Check whether the editor has focus.
    get hasFocus() {
        return this.root.activeElement == this.contentDOM;
    }
    /// Put focus on the editor.
    focus() {
        this.observer.ignore(() => {
            focusPreventScroll(this.contentDOM);
            this.docView.updateSelection();
        });
    }
    /// Clean up this editor view, removing its element from the
    /// document, unregistering event handlers, and notifying
    /// plugins. The view instance can no longer be used after
    /// calling this.
    destroy() {
        for (let plugin of this.plugins)
            plugin.destroy(this);
        this.inputState.destroy();
        this.dom.remove();
        this.observer.destroy();
        if (this.measureScheduled > -1)
            cancelAnimationFrame(this.measureScheduled);
    }
    /// Facet that can be used to add DOM event handlers. The value
    /// should be an object mapping event names to handler functions. The
    /// first such function to return true will be assumed to have handled
    /// that event, and no other handlers or built-in behavior will be
    /// activated for it.
    static domEventHandlers(handlers) {
        return ViewPlugin.define(() => ({})).eventHandlers(handlers);
    }
    /// Create a theme extension. The argument object should map [theme
    /// selectors](#view.themeClass) to styles, which are (potentially
    /// nested) [style
    /// declarations](https://github.com/marijnh/style-mod#documentation)
    /// providing the CSS styling for the selector.
    ///
    /// When `dark` is set to true, the theme will be marked as dark,
    /// which causes the [base theme](#view.EditorView^baseTheme) rules
    /// marked with `@dark` to apply instead of those marked with
    /// `@light`.
    static theme(spec, options) {
        let prefix = StyleModule.newName();
        let result = [theme.of(prefix), styleModule.of(buildTheme(prefix, spec))];
        if (options && options.dark)
            result.push(darkTheme.of(true));
        return result;
    }
    /// Create an extension that adds styles to the base theme. The
    /// given object works much like the one passed to
    /// [`theme`](#view.EditorView^theme), but allows selectors to be
    /// marked by adding `@dark` to their end to only apply when there
    /// is a dark theme active, or by `@light` to only apply when there
    /// is _no_ dark theme active.
    static baseTheme(spec) {
        return Precedence.Fallback.set(styleModule.of(buildTheme(baseThemeID, spec)));
    }
}
/// Facet to add a [style
/// module](https://github.com/marijnh/style-mod#readme) to an editor
/// view. The view will ensure that the module is registered in its
/// [document root](#view.EditorView.constructor^config.root).
EditorView.styleModule = styleModule;
/// Allows you to provide a function that should be called when the
/// library catches an exception from an extension (mostly from view
/// plugins, but may be used by other extensions to route exceptions
/// from user-code-provided callbacks). This is mostly useful for
/// debugging and logging. See [`logException`](#view.logException).
EditorView.exceptionSink = exceptionSink;
/// Facet that controls whether the editor content is editable. When
/// its the highest-precedence value is `false`, editing is
/// disabled, and the content element will no longer have its
/// `contenteditable` attribute set to `true`. (Note that this
/// doesn't affect API calls that change the editor content, even
/// when those are bound to keys or buttons.)
EditorView.editable = editable;
/// Facet used to configure whether a given selection drag event
/// should move or copy the selection. The given predicate will be
/// called with the `mousedown` event, and can return `true` when
/// the drag should move the content.
EditorView.dragMovesSelection = dragMovesSelection;
/// Facet used to configure whether a given selecting click adds
/// a new range to the existing selection or replaces it entirely.
EditorView.clickAddsSelectionRange = clickAddsSelectionRange;
/// Allows you to influence the way mouse selection happens. The
/// functions in this facet will be called for a `mousedown` event
/// on the editor, and can return an object that overrides the way a
/// selection is computed from that mouse click or drag.
EditorView.mouseSelectionStyle = mouseSelectionStyle;
/// A facet that determines which [decorations](#view.Decoration)
/// are shown in the view. See also [view
/// plugins](#view.EditorView^decorations), which have a separate
/// mechanism for providing decorations.
EditorView.decorations = decorations;
/// An extension that enables line wrapping in the editor.
EditorView.lineWrapping = EditorView.theme({ content: { whiteSpace: "pre-wrap" } });
/// Facet that provides attributes for the editor's editable DOM
/// element.
EditorView.contentAttributes = contentAttributes;
/// Facet that provides editor DOM attributes for the editor's
/// outer element.
EditorView.editorAttributes = editorAttributes;
// Maximum line length for which we compute accurate bidi info
const MaxBidiLine = 4096;
function ensureTop(given, dom) {
    return given == null ? dom.getBoundingClientRect().top : given;
}
let resizeDebounce = -1;
function ensureGlobalHandler() {
    window.addEventListener("resize", () => {
        if (resizeDebounce == -1)
            resizeDebounce = setTimeout(handleResize, 50);
    });
}
function handleResize() {
    resizeDebounce = -1;
    let found = document.querySelectorAll(".cm-content");
    for (let i = 0; i < found.length; i++) {
        let docView = ContentView.get(found[i]);
        if (docView)
            docView.editorView.requestMeasure();
    }
}
const BadMeasure = {};
class CachedOrder {
    constructor(from, to, dir, order) {
        this.from = from;
        this.to = to;
        this.dir = dir;
        this.order = order;
    }
    static update(cache, changes) {
        if (changes.empty)
            return cache;
        let result = [], lastDir = cache.length ? cache[cache.length - 1].dir : Direction.LTR;
        for (let i = Math.max(0, cache.length - 10); i < cache.length; i++) {
            let entry = cache[i];
            if (entry.dir == lastDir && !changes.touchesRange(entry.from, entry.to))
                result.push(new CachedOrder(changes.mapPos(entry.from, 1), changes.mapPos(entry.to, -1), entry.dir, entry.order));
        }
        return result;
    }
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics$1 = function(d, b) {
    extendStatics$1 = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics$1(d, b);
};

function __extends$1(d, b) {
    extendStatics$1(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

/// A parse stack. These are used internally by the parser to track
/// parsing progress. They also provide some properties and methods
/// that external code such as a tokenizer can use to get information
/// about the parse state.
var Stack = /** @class */ (function () {
    /// @internal
    function Stack(
    // A group of values that the stack will share with all
    // split instances
    ///@internal
    cx, 
    // Holds state, pos, value stack pos (15 bits array index, 15 bits
    // buffer index) triplets for all but the top state
    /// @internal
    stack, 
    // The current parse state
    /// @internal
    state, 
    // The position at which the next reduce should take place. This
    // can be less than `this.pos` when skipped expressions have been
    // added to the stack (which should be moved outside of the next
    // reduction)
    /// @internal
    reducePos, 
    // The input position up to which this stack has parsed.
    pos, 
    // The amount of error-recovery that happened on this stack
    /// @internal
    recovered, 
    // The output buffer. Holds (type, start, end, size) quads
    // representing nodes created by the parser, where `size` is
    // amount of buffer array entries covered by this node.
    /// @internal
    buffer, 
    // The base offset of the buffer. When stacks are split, the split
    // instance shared the buffer history with its parent up to
    // `bufferBase`, which is the absolute offset (including the
    // offset of previous splits) into the buffer at which this stack
    // starts writing.
    /// @internal
    bufferBase, 
    // A parent stack from which this was split off, if any. This is
    // set up so that it always points to a stack that has some
    // additional buffer content, never to a stack with an equal
    // `bufferBase`.
    /// @internal
    parent) {
        this.cx = cx;
        this.stack = stack;
        this.state = state;
        this.reducePos = reducePos;
        this.pos = pos;
        this.recovered = recovered;
        this.buffer = buffer;
        this.bufferBase = bufferBase;
        this.parent = parent;
    }
    /// @internal
    Stack.prototype.toString = function () {
        return "[" + this.stack.filter(function (_, i) { return i % 3 == 0; }).concat(this.state) + "]@" + this.pos + (this.recovered ? "!" + this.recovered : "");
    };
    // Start an empty stack
    /// @internal
    Stack.start = function (cx, state, pos) {
        if (pos === void 0) { pos = 0; }
        return new Stack(cx, [], state, pos, pos, 0, [], 0, null);
    };
    // Push a state onto the stack, tracking its start position as well
    // as the buffer base at that point.
    /// @internal
    Stack.prototype.pushState = function (state, start) {
        this.stack.push(this.state, start, this.bufferBase + this.buffer.length);
        this.state = state;
    };
    // Apply a reduce action
    /// @internal
    Stack.prototype.reduce = function (action) {
        var depth = action >> 19 /* ReduceDepthShift */, type = action & 65535 /* ValueMask */;
        var parser = this.cx.parser;
        if (depth == 0) {
            // Zero-depth reductions are a special case—they add stuff to
            // the stack without popping anything off.
            if (type < parser.minRepeatTerm)
                this.storeNode(type, this.reducePos, this.reducePos, 4, true);
            this.pushState(parser.getGoto(this.state, type, true), this.reducePos);
            return;
        }
        // Find the base index into `this.stack`, content after which will
        // be dropped. Note that with `StayFlag` reductions we need to
        // consume two extra frames (the dummy parent node for the skipped
        // expression and the state that we'll be staying in, which should
        // be moved to `this.state`).
        var base = this.stack.length - ((depth - 1) * 3) - (action & 262144 /* StayFlag */ ? 6 : 0);
        var start = this.stack[base - 2];
        var bufferBase = this.stack[base - 1], count = this.bufferBase + this.buffer.length - bufferBase;
        if (type < parser.minRepeatTerm || // Normal term
            (action & 131072 /* RepeatFlag */) || // Inner repeat marker
            (type > parser.maxNode && type <= parser.maxRepeatWrap)) { // Repeat wrapper
            var pos = parser.stateFlag(this.state, 1 /* Skipped */) ? this.pos : this.reducePos;
            this.storeNode(type, start, pos, count + 4, true);
        }
        if (action & 262144 /* StayFlag */) {
            this.state = this.stack[base];
        }
        else {
            var baseStateID = this.stack[base - 3];
            this.state = parser.getGoto(baseStateID, type, true);
        }
        while (this.stack.length > base)
            this.stack.pop();
    };
    // Shift a value into the buffer
    /// @internal
    Stack.prototype.storeNode = function (term, start, end, size, isReduce) {
        if (size === void 0) { size = 4; }
        if (isReduce === void 0) { isReduce = false; }
        if (term == 0 /* Err */) { // Try to omit/merge adjacent error nodes
            var cur = this, top = this.buffer.length;
            if (top == 0 && cur.parent) {
                top = cur.bufferBase - cur.parent.bufferBase;
                cur = cur.parent;
            }
            if (top > 0 && cur.buffer[top - 4] == 0 /* Err */ && cur.buffer[top - 1] > -1) {
                if (start == end)
                    return;
                if (cur.buffer[top - 2] >= start) {
                    cur.buffer[top - 2] = end;
                    return;
                }
            }
        }
        if (!isReduce || this.pos == end) { // Simple case, just append
            this.buffer.push(term, start, end, size);
        }
        else { // There may be skipped nodes that have to be moved forward
            var index = this.buffer.length;
            if (index > 0 && this.buffer[index - 4] != 0 /* Err */)
                while (index > 0 && this.buffer[index - 2] > end) {
                    // Move this record forward
                    this.buffer[index] = this.buffer[index - 4];
                    this.buffer[index + 1] = this.buffer[index - 3];
                    this.buffer[index + 2] = this.buffer[index - 2];
                    this.buffer[index + 3] = this.buffer[index - 1];
                    index -= 4;
                    if (size > 4)
                        size -= 4;
                }
            this.buffer[index] = term;
            this.buffer[index + 1] = start;
            this.buffer[index + 2] = end;
            this.buffer[index + 3] = size;
        }
    };
    // Apply a shift action
    /// @internal
    Stack.prototype.shift = function (action, next, nextEnd) {
        if (action & 131072 /* GotoFlag */) {
            this.pushState(action & 65535 /* ValueMask */, this.pos);
        }
        else if ((action & 262144 /* StayFlag */) == 0) { // Regular shift
            var start = this.pos, nextState = action, parser = this.cx.parser;
            if (nextEnd > this.pos || next <= parser.maxNode) {
                this.pos = nextEnd;
                if (!parser.stateFlag(nextState, 1 /* Skipped */))
                    this.reducePos = nextEnd;
            }
            this.pushState(nextState, start);
            if (next <= parser.maxNode)
                this.buffer.push(next, start, nextEnd, 4);
        }
        else { // Shift-and-stay, which means this is a skipped token
            if (next <= this.cx.parser.maxNode)
                this.buffer.push(next, this.pos, nextEnd, 4);
            this.pos = nextEnd;
        }
    };
    // Apply an action
    /// @internal
    Stack.prototype.apply = function (action, next, nextEnd) {
        if (action & 65536 /* ReduceFlag */)
            this.reduce(action);
        else
            this.shift(action, next, nextEnd);
    };
    // Add a prebuilt node into the buffer. This may be a reused node or
    // the result of running a nested parser.
    /// @internal
    Stack.prototype.useNode = function (value, next) {
        var index = this.cx.reused.length - 1;
        if (index < 0 || this.cx.reused[index] != value) {
            this.cx.reused.push(value);
            index++;
        }
        var start = this.pos;
        this.reducePos = this.pos = start + value.length;
        this.pushState(next, start);
        this.buffer.push(index, start, this.reducePos, -1 /* size < 0 means this is a reused value */);
    };
    // Split the stack. Due to the buffer sharing and the fact
    // that `this.stack` tends to stay quite shallow, this isn't very
    // expensive.
    /// @internal
    Stack.prototype.split = function () {
        var parent = this;
        var off = parent.buffer.length;
        // Because the top of the buffer (after this.pos) may be mutated
        // to reorder reductions and skipped tokens, and shared buffers
        // should be immutable, this copies any outstanding skipped tokens
        // to the new buffer, and puts the base pointer before them.
        while (off > 0 && parent.buffer[off - 2] > parent.reducePos)
            off -= 4;
        var buffer = parent.buffer.slice(off), base = parent.bufferBase + off;
        // Make sure parent points to an actual parent with content, if there is such a parent.
        while (parent && base == parent.bufferBase)
            parent = parent.parent;
        return new Stack(this.cx, this.stack.slice(), this.state, this.reducePos, this.pos, this.recovered, buffer, base, parent);
    };
    // Try to recover from an error by 'deleting' (ignoring) one token.
    /// @internal
    Stack.prototype.recoverByDelete = function (next, nextEnd) {
        var isNode = next <= this.cx.parser.maxNode;
        if (isNode)
            this.storeNode(next, this.pos, nextEnd);
        this.storeNode(0 /* Err */, this.pos, nextEnd, isNode ? 8 : 4);
        this.pos = this.reducePos = nextEnd;
        this.recovered += 2 /* Token */;
    };
    /// Check if the given term would be able to be shifted (optionally
    /// after some reductions) on this stack. This can be useful for
    /// external tokenizers that want to make sure they only provide a
    /// given token when it applies.
    Stack.prototype.canShift = function (term) {
        for (var sim = new SimulatedStack(this);;) {
            var action = this.cx.parser.stateSlot(sim.top, 4 /* DefaultReduce */) || this.cx.parser.hasAction(sim.top, term);
            if ((action & 65536 /* ReduceFlag */) == 0)
                return true;
            if (action == 0)
                return false;
            sim.reduce(action);
        }
    };
    Object.defineProperty(Stack.prototype, "ruleStart", {
        /// Find the start position of the rule that is currently being parsed.
        get: function () {
            var force = this.cx.parser.stateSlot(this.state, 5 /* ForcedReduce */);
            if (!(force & 65536 /* ReduceFlag */))
                return 0;
            var base = this.stack.length - (3 * (force >> 19 /* ReduceDepthShift */));
            return this.stack[base + 1];
        },
        enumerable: true,
        configurable: true
    });
    /// Find the start position of the innermost instance of any of the
    /// given term types, or return `-1` when none of them are found.
    ///
    /// **Note:** this is only reliable when there is at least some
    /// state that unambiguously matches the given rule on the stack.
    /// I.e. if you have a grammar like this, where the difference
    /// between `a` and `b` is only apparent at the third token:
    ///
    ///     a { b | c }
    ///     b { "x" "y" "x" }
    ///     c { "x" "y" "z" }
    ///
    /// Then a parse state after `"x"` will not reliably tell you that
    /// `b` is on the stack. You _can_ pass `[b, c]` to reliably check
    /// for either of those two rules (assuming that `a` isn't part of
    /// some rule that includes other things starting with `"x"`).
    Stack.prototype.startOf = function (types) {
        var state = this.state, frame = this.stack.length, parser = this.cx.parser;
        for (;;) {
            var force = parser.stateSlot(state, 5 /* ForcedReduce */);
            var depth = force >> 19 /* ReduceDepthShift */, term = force & 65535 /* ValueMask */;
            if (types.includes(term)) {
                var base = frame - (3 * (force >> 19 /* ReduceDepthShift */));
                return this.stack[base + 1];
            }
            if (frame == 0)
                return -1;
            if (depth == 0) {
                frame -= 3;
                state = this.stack[frame];
            }
            else {
                frame -= 3 * (depth - 1);
                state = parser.getGoto(this.stack[frame - 3], term, true);
            }
        }
    };
    // Apply up to Recover.MaxNext recovery actions that conceptually
    // inserts some missing token or rule.
    /// @internal
    Stack.prototype.recoverByInsert = function (next) {
        var _this = this;
        var nextStates = this.cx.parser.nextStates(this.state);
        if (nextStates.length > 4 /* MaxNext */) {
            var best = nextStates.filter(function (s) { return s != _this.state && _this.cx.parser.hasAction(s, next); });
            for (var i = 0; best.length < 4 /* MaxNext */ && i < nextStates.length; i++)
                if (!best.includes(nextStates[i]))
                    best.push(nextStates[i]);
            nextStates = best;
        }
        var result = [];
        for (var i = 0; i < nextStates.length && result.length < 4 /* MaxNext */; i++) {
            if (nextStates[i] == this.state)
                continue;
            var stack = this.split();
            stack.storeNode(0 /* Err */, stack.pos, stack.pos, 4, true);
            stack.pushState(nextStates[i], this.pos);
            stack.recovered += 2 /* Token */;
            result.push(stack);
        }
        return result;
    };
    // Force a reduce, if possible. Return false if that can't
    // be done.
    /// @internal
    Stack.prototype.forceReduce = function () {
        var reduce = this.cx.parser.stateSlot(this.state, 5 /* ForcedReduce */);
        if ((reduce & 65536 /* ReduceFlag */) == 0)
            return false;
        if (!this.cx.parser.validAction(this.state, reduce)) {
            this.storeNode(0 /* Err */, this.reducePos, this.reducePos, 4, true);
            this.recovered += 1 /* Reduce */;
        }
        this.reduce(reduce);
        return true;
    };
    /// @internal
    Stack.prototype.forceAll = function () {
        while (!this.cx.parser.stateFlag(this.state, 2 /* Accepting */) && this.forceReduce()) { }
        return this;
    };
    // Convert the stack's buffer to a syntax tree.
    /// @internal
    Stack.prototype.toTree = function () {
        return Tree.build({ buffer: StackBufferCursor.create(this),
            group: this.cx.parser.group,
            topID: this.cx.topTerm,
            maxBufferLength: this.cx.maxBufferLength,
            reused: this.cx.reused,
            minRepeatType: this.cx.parser.minRepeatTerm });
    };
    return Stack;
}());
var Recover;
(function (Recover) {
    Recover[Recover["Token"] = 2] = "Token";
    Recover[Recover["Reduce"] = 1] = "Reduce";
    Recover[Recover["MaxNext"] = 4] = "MaxNext";
})(Recover || (Recover = {}));
// Used to cheaply run some reductions to scan ahead without mutating
// an entire stack
var SimulatedStack = /** @class */ (function () {
    function SimulatedStack(stack) {
        this.stack = stack;
        this.top = stack.state;
        this.rest = stack.stack;
        this.offset = this.rest.length;
    }
    SimulatedStack.prototype.reduce = function (action) {
        var term = action & 65535 /* ValueMask */, depth = action >> 19 /* ReduceDepthShift */;
        if (depth == 0) {
            if (this.rest == this.stack.stack)
                this.rest = this.rest.slice();
            this.rest.push(this.top, 0, 0);
            this.offset += 3;
        }
        else {
            this.offset -= (depth - 1) * 3;
        }
        var goto = this.stack.cx.parser.getGoto(this.rest[this.offset - 3], term, true);
        this.top = goto;
    };
    return SimulatedStack;
}());
// This is given to `Tree.build` to build a buffer, and encapsulates
// the parent-stack-walking necessary to read the nodes.
var StackBufferCursor = /** @class */ (function () {
    function StackBufferCursor(stack, pos, index) {
        this.stack = stack;
        this.pos = pos;
        this.index = index;
        this.buffer = stack.buffer;
        if (this.index == 0)
            this.maybeNext();
    }
    StackBufferCursor.create = function (stack) {
        return new StackBufferCursor(stack, stack.bufferBase + stack.buffer.length, stack.buffer.length);
    };
    StackBufferCursor.prototype.maybeNext = function () {
        var next = this.stack.parent;
        if (next != null) {
            this.index = this.stack.bufferBase - next.bufferBase;
            this.stack = next;
            this.buffer = next.buffer;
        }
    };
    Object.defineProperty(StackBufferCursor.prototype, "id", {
        get: function () { return this.buffer[this.index - 4]; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StackBufferCursor.prototype, "start", {
        get: function () { return this.buffer[this.index - 3]; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StackBufferCursor.prototype, "end", {
        get: function () { return this.buffer[this.index - 2]; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StackBufferCursor.prototype, "size", {
        get: function () { return this.buffer[this.index - 1]; },
        enumerable: true,
        configurable: true
    });
    StackBufferCursor.prototype.next = function () {
        this.index -= 4;
        this.pos -= 4;
        if (this.index == 0)
            this.maybeNext();
    };
    StackBufferCursor.prototype.fork = function () {
        return new StackBufferCursor(this.stack, this.pos, this.index);
    };
    return StackBufferCursor;
}());

/// Tokenizers write the tokens they read into instances of this class.
var Token = /** @class */ (function () {
    function Token() {
        /// The start of the token. This is set by the parser, and should not
        /// be mutated by the tokenizer.
        this.start = -1;
        /// This starts at -1, and should be updated to a term id when a
        /// matching token is found.
        this.value = -1;
        /// When setting `.value`, you should also set `.end` to the end
        /// position of the token. (You'll usually want to use the `accept`
        /// method.)
        this.end = -1;
    }
    /// Accept a token, setting `value` and `end` to the given values.
    Token.prototype.accept = function (value, end) {
        this.value = value;
        this.end = end;
    };
    return Token;
}());
/// An `InputStream` that is backed by a single, flat string.
var StringStream = /** @class */ (function () {
    function StringStream(string, length) {
        if (length === void 0) { length = string.length; }
        this.string = string;
        this.length = length;
    }
    StringStream.prototype.get = function (pos) {
        return pos < 0 || pos >= this.length ? -1 : this.string.charCodeAt(pos);
    };
    StringStream.prototype.read = function (from, to) { return this.string.slice(from, Math.min(this.length, to)); };
    StringStream.prototype.clip = function (at) { return new StringStream(this.string, at); };
    return StringStream;
}());
/// @internal
var TokenGroup = /** @class */ (function () {
    function TokenGroup(data, id) {
        this.data = data;
        this.id = id;
    }
    TokenGroup.prototype.token = function (input, token, stack) { readToken(this.data, input, token, stack, this.id); };
    return TokenGroup;
}());
TokenGroup.prototype.contextual = false;
var ExternalTokenizer = /** @class */ (function () {
    function ExternalTokenizer(token, options) {
        if (options === void 0) { options = {}; }
        this.token = token;
        this.contextual = options && options.contextual || false;
    }
    return ExternalTokenizer;
}());
// Tokenizer data is stored a big uint16 array containing, for each
// state:
//
//  - A group bitmask, indicating what token groups are reachable from
//    this state, so that paths that can only lead to tokens not in
//    any of the current groups can be cut off early.
//
//  - The position of the end of the state's sequence of accepting
//    tokens
//
//  - The number of outgoing edges for the state
//
//  - The accepting tokens, as (token id, group mask) pairs
//
//  - The outgoing edges, as (start character, end character, state
//    index) triples, with end character being exclusive
//
// This function interprets that data, running through a stream as
// long as new states with the a matching group mask can be reached,
// and updating `token` when it matches a token.
function readToken(data, input, token, stack, group) {
    var state = 0, groupMask = 1 << group;
    scan: for (var pos = token.start;;) {
        if ((groupMask & data[state]) == 0)
            break;
        var accEnd = data[state + 1];
        // Check whether this state can lead to a token in the current group
        // Accept tokens in this state, possibly overwriting
        // lower-precedence / shorter tokens
        for (var i = state + 3; i < accEnd; i += 2)
            if ((data[i + 1] & groupMask) > 0) {
                var term = data[i];
                if (token.value == -1 || token.value == term || stack.cx.parser.overrides(term, token.value)) {
                    token.accept(term, pos);
                    break;
                }
            }
        var next = input.get(pos++);
        // Do a binary search on the state's edges
        for (var low = 0, high = data[state + 2]; low < high;) {
            var mid = (low + high) >> 1;
            var index = accEnd + mid + (mid << 1);
            var from = data[index], to = data[index + 1];
            if (next < from)
                high = mid;
            else if (next >= to)
                low = mid + 1;
            else {
                state = data[index + 2];
                continue scan;
            }
        }
        break;
    }
}

// See lezer-generator/src/encode.ts for comments about the encoding
// used here
function decodeArray(input, Type) {
    if (Type === void 0) { Type = Uint16Array; }
    var array = null;
    for (var pos = 0, out = 0; pos < input.length;) {
        var value = 0;
        for (;;) {
            var next = input.charCodeAt(pos++), stop = false;
            if (next == 126 /* BigValCode */) {
                value = 65535 /* BigVal */;
                break;
            }
            if (next >= 92 /* Gap2 */)
                next--;
            if (next >= 34 /* Gap1 */)
                next--;
            var digit = next - 32 /* Start */;
            if (digit >= 46 /* Base */) {
                digit -= 46 /* Base */;
                stop = true;
            }
            value += digit;
            if (stop)
                break;
            value *= 46 /* Base */;
        }
        if (array)
            array[out++] = value;
        else
            array = new Type(value);
    }
    return array;
}

// Environment variable used to control console output
var verbose = typeof process != "undefined" && /\bparse\b/.test(process.env.LOG);
var CacheCursor = /** @class */ (function () {
    function CacheCursor(tree) {
        this.start = [0];
        this.index = [0];
        this.nextStart = 0;
        this.trees = [tree];
    }
    // `pos` must be >= any previously given `pos` for this cursor
    CacheCursor.prototype.nodeAt = function (pos) {
        if (pos < this.nextStart)
            return null;
        for (;;) {
            var last = this.trees.length - 1;
            if (last < 0) { // End of tree
                this.nextStart = 1e9;
                return null;
            }
            var top = this.trees[last], index = this.index[last];
            if (index == top.children.length) {
                this.trees.pop();
                this.start.pop();
                this.index.pop();
                continue;
            }
            var next = top.children[index];
            var start = this.start[last] + top.positions[index];
            if (start >= pos)
                return start == pos ? next : null;
            if (next instanceof TreeBuffer) {
                this.index[last]++;
                this.nextStart = start + next.length;
            }
            else {
                this.index[last]++;
                if (start + next.length >= pos) { // Enter this node
                    this.trees.push(next);
                    this.start.push(start);
                    this.index.push(0);
                }
            }
        }
    };
    return CacheCursor;
}());
var CachedToken = /** @class */ (function (_super) {
    __extends$1(CachedToken, _super);
    function CachedToken() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.extended = -1;
        _this.mask = 0;
        return _this;
    }
    CachedToken.prototype.clear = function (start) {
        this.start = start;
        this.value = this.extended = -1;
    };
    return CachedToken;
}(Token));
var dummyToken = new Token;
var TokenCache = /** @class */ (function () {
    function TokenCache(parser) {
        this.tokens = [];
        this.mainToken = dummyToken;
        this.actions = [];
        this.tokens = parser.tokenizers.map(function (_) { return new CachedToken; });
    }
    TokenCache.prototype.getActions = function (stack, input) {
        var actionIndex = 0;
        var main = null;
        var parser = stack.cx.parser, tokenizers = parser.tokenizers;
        var mask = parser.stateSlot(stack.state, 3 /* TokenizerMask */);
        for (var i = 0; i < tokenizers.length; i++) {
            if (((1 << i) & mask) == 0)
                continue;
            var tokenizer = tokenizers[i], token = this.tokens[i];
            if (tokenizer.contextual || token.start != stack.pos || token.mask != mask) {
                this.updateCachedToken(token, tokenizer, stack, input);
                token.mask = mask;
            }
            var startIndex = actionIndex;
            if (token.extended > -1)
                actionIndex = this.addActions(stack, token.extended, token.end, actionIndex);
            actionIndex = this.addActions(stack, token.value, token.end, actionIndex);
            if (actionIndex > startIndex) {
                main = token;
                break;
            }
            if (!main || token.value != 0 /* Err */)
                main = token;
        }
        while (this.actions.length > actionIndex)
            this.actions.pop();
        if (!main) {
            main = dummyToken;
            main.start = stack.pos;
            if (stack.pos == input.length)
                main.accept(stack.cx.parser.eofTerm, stack.pos);
            else
                main.accept(0 /* Err */, stack.pos + 1);
        }
        this.mainToken = main;
        return this.actions;
    };
    TokenCache.prototype.updateCachedToken = function (token, tokenizer, stack, input) {
        token.clear(stack.pos);
        tokenizer.token(input, token, stack);
        if (token.value > -1) {
            var parser = stack.cx.parser;
            var specIndex = findOffset(parser.data, parser.specializeTable, token.value);
            if (specIndex >= 0) {
                var found = parser.specializations[specIndex][input.read(token.start, token.end)];
                if (found != null) {
                    if ((found & 1) == 0 /* Specialize */)
                        token.value = found >> 1;
                    else
                        token.extended = found >> 1;
                }
            }
        }
        else if (stack.pos == input.length) {
            token.accept(stack.cx.parser.eofTerm, stack.pos);
        }
        else {
            token.accept(0 /* Err */, stack.pos + 1);
        }
    };
    TokenCache.prototype.putAction = function (action, token, end, index) {
        // Don't add duplicate actions
        for (var i = 0; i < index; i += 3)
            if (this.actions[i] == action)
                return index;
        this.actions[index++] = action;
        this.actions[index++] = token;
        this.actions[index++] = end;
        return index;
    };
    TokenCache.prototype.addActions = function (stack, token, end, index) {
        var state = stack.state, parser = stack.cx.parser, data = parser.data;
        for (var set = 0; set < 2; set++) {
            for (var i = parser.stateSlot(state, set ? 2 /* Skip */ : 1 /* Actions */), next = void 0; (next = data[i]) != 65535 /* End */; i += 3) {
                if (next == token || (next == 0 /* Err */ && index == 0))
                    index = this.putAction(data[i + 1] | (data[i + 2] << 16), token, end, index);
            }
        }
        return index;
    };
    return TokenCache;
}());
var StackContext = /** @class */ (function () {
    function StackContext(parser, maxBufferLength, input, topTerm, parent, wrapType // Set to -2 when a stack descending from this nesting event finishes
    ) {
        if (parent === void 0) { parent = null; }
        if (wrapType === void 0) { wrapType = -1; }
        this.parser = parser;
        this.maxBufferLength = maxBufferLength;
        this.input = input;
        this.topTerm = topTerm;
        this.parent = parent;
        this.wrapType = wrapType;
        this.reused = [];
        this.tokens = new TokenCache(parser);
    }
    return StackContext;
}());
var recoverDist = 5, maxRemainingPerStep = 3, minBufferLengthPrune = 200, forceReduceLimit = 10;
/// A parse context can be used for step-by-step parsing. After
/// creating it, you repeatedly call `.advance()` until it returns a
/// tree to indicate it has reached the end of the parse.
var ParseContext = /** @class */ (function () {
    /// @internal
    function ParseContext(parser, input, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.cache, cache = _c === void 0 ? undefined : _c, _d = _b.strict, strict = _d === void 0 ? false : _d, _e = _b.bufferLength, bufferLength = _e === void 0 ? DefaultBufferLength : _e, _f = _b.top, top = _f === void 0 ? undefined : _f;
        // The position to which the parse has advanced.
        this.pos = 0;
        this.recovering = 0;
        this.tokenCount = 0;
        var topInfo = top ? parser.topRules[top] : parser.defaultTop;
        if (!topInfo)
            throw new RangeError("Invalid top rule name " + top);
        this.stacks = [Stack.start(new StackContext(parser, bufferLength, input, topInfo[1]), topInfo[0])];
        this.strict = strict;
        this.cache = cache ? new CacheCursor(cache) : null;
    }
    /// @internal
    ParseContext.prototype.putStack = function (stack) {
        this.stacks.push(stack);
        if (this.pos < 0 || stack.pos < this.pos)
            this.pos = stack.pos;
    };
    /// Move the parser forward. This will process all parse stacks at
    /// `this.pos` and try to advance them to a further position. If no
    /// stack for such a position is found, it'll start error-recovery.
    ///
    /// When the parse is finished, this will return a syntax tree. When
    /// not, it returns `null`.
    ParseContext.prototype.advance = function () {
        var stacks = this.stacks, pos = this.pos;
        // This will now hold stacks beyond `pos`.
        this.stacks = [];
        // Will be reset to the next position by `putStack`.
        this.pos = -1;
        var stopped = null, stoppedTokens = null;
        // Keep advancing any stacks at `pos` until they either move
        // forward or can't be advanced. Gather stacks that can't be
        // advanced further in `stopped`.
        for (var i = 0; i < stacks.length; i++) {
            var stack = stacks[i];
            for (;;) {
                if (stack.pos > pos) {
                    this.putStack(stack);
                }
                else {
                    var result = this.advanceStack(stack, stacks);
                    if (result) {
                        stack = result;
                        continue;
                    }
                    else {
                        if (!stopped) {
                            stopped = [];
                            stoppedTokens = [];
                        }
                        stopped.push(stack);
                        var tok = stack.cx.tokens.mainToken;
                        stoppedTokens.push(tok.value, tok.end);
                    }
                }
                break;
            }
        }
        if (!this.stacks.length) {
            var finished = stopped && findFinished(stopped);
            if (finished)
                return finished.toTree();
            if (this.strict)
                throw new SyntaxError("No parse at " + pos);
            if (!this.recovering)
                this.recovering = recoverDist;
        }
        if (this.recovering && stopped) {
            var finished = this.runRecovery(stopped, stoppedTokens);
            if (finished)
                return finished.forceAll().toTree();
        }
        if (this.recovering) {
            var maxRemaining = this.recovering == 1 ? 1 : this.recovering * maxRemainingPerStep;
            if (this.stacks.length > maxRemaining) {
                this.stacks.sort(function (a, b) { return a.recovered - b.recovered; });
                this.stacks.length = maxRemaining;
            }
            if (this.stacks.some(function (s) { return s.reducePos > pos; }))
                this.recovering--;
        }
        else if (this.stacks.length > 1 && this.stacks[0].buffer.length > minBufferLengthPrune) {
            // Prune stacks that have been running without splitting for a
            // while, to avoid getting stuck with multiple successful stacks
            // running endlessly on.
            var minLen = 1e9, minI = -1;
            for (var i = 0; i < this.stacks.length; i++) {
                var stack = this.stacks[i];
                if (stack.buffer.length < minLen) {
                    minLen = stack.buffer.length;
                    minI = i;
                }
            }
            if (minLen > minBufferLengthPrune)
                this.stacks.splice(minI, 1);
        }
        this.tokenCount++;
        return null;
    };
    // Returns an updated version of the given stack, or null if the
    // stack can't advance normally. When `split` is given, stacks split
    // off by ambiguous operations will be pushed to that, or given to
    // `putStack` if they move `pos` forward.
    ParseContext.prototype.advanceStack = function (stack, split) {
        var start = stack.pos, _a = stack.cx, input = _a.input, parser = _a.parser;
        var base = verbose ? stack + " -> " : "";
        if (this.cache) {
            for (var cached = this.cache.nodeAt(start); cached;) {
                var match = parser.group.types[cached.type.id] == cached.type ? parser.getGoto(stack.state, cached.type.id) : -1;
                if (match > -1) {
                    stack.useNode(cached, match);
                    if (verbose)
                        console.log(base + stack + (" (via reuse of " + parser.getName(cached.type.id) + ")"));
                    return stack;
                }
                if (!(cached instanceof Tree) || cached.children.length == 0 || cached.positions[0] > 0)
                    break;
                var inner = cached.children[0];
                if (inner instanceof Tree)
                    cached = inner;
                else
                    break;
            }
        }
        var nest = parser.startNested(stack.state);
        maybeNest: if (nest > -1) {
            var _b = parser.nested[nest], grammar = _b.grammar, endToken = _b.end, placeholder = _b.placeholder;
            var filterEnd = undefined, parseNode = null, nested = void 0, top = void 0, wrapType = undefined;
            if (typeof grammar == "function") {
                var query = grammar(input, stack);
                if (query.stay)
                    break maybeNest;
                (parseNode = query.parseNode, nested = query.parser, top = query.top, filterEnd = query.filterEnd, wrapType = query.wrapType);
            }
            else {
                nested = grammar;
            }
            var end = this.scanForNestEnd(stack, endToken, filterEnd);
            var clippedInput = stack.cx.input.clip(end);
            if (parseNode || !nested) {
                var node = parseNode ? parseNode(clippedInput, stack.pos) : Tree.empty;
                if (node.length != end - stack.pos)
                    node = new Tree(node.type, node.children, node.positions, end - stack.pos);
                if (wrapType != null)
                    node = new Tree(parser.group.types[wrapType], [node], [0], node.length);
                stack.useNode(node, parser.getGoto(stack.state, placeholder, true));
                return stack;
            }
            else {
                var topInfo = top ? nested.topRules[top] : nested.defaultTop;
                var newStack = Stack.start(new StackContext(nested, stack.cx.maxBufferLength, clippedInput, topInfo[1], stack, wrapType), topInfo[0], stack.pos);
                if (verbose)
                    console.log(base + newStack + " (nested)");
                return newStack;
            }
        }
        var defaultReduce = parser.stateSlot(stack.state, 4 /* DefaultReduce */);
        if (defaultReduce > 0) {
            stack.reduce(defaultReduce);
            if (verbose)
                console.log(base + stack + (" (via always-reduce " + parser.getName(defaultReduce & 65535 /* ValueMask */) + ")"));
            return stack;
        }
        var actions = stack.cx.tokens.getActions(stack, input);
        for (var i = 0; i < actions.length;) {
            var action = actions[i++], term = actions[i++], end = actions[i++];
            var last = i == actions.length || !split;
            var localStack = last ? stack : stack.split();
            localStack.apply(action, term, end);
            if (verbose)
                console.log(base + localStack + (" (via " + ((action & 65536 /* ReduceFlag */) == 0 ? "shift"
                    : "reduce of " + parser.getName(action & 65535 /* ValueMask */)) + " for " + parser.getName(term) + " @ " + start + (localStack == stack ? "" : ", split") + ")"));
            if (last)
                return localStack;
            else if (localStack.pos > start)
                this.putStack(localStack);
            else
                split.push(localStack);
        }
        if (stack.cx.parent && stack.pos == input.length)
            return finishNested(stack);
        return null;
    };
    // Advance a given stack forward as far as it will go. Returns the
    // (possibly updated) stack if it got stuck, or null if it moved
    // forward and was given to `putStack`.
    ParseContext.prototype.advanceFully = function (stack) {
        var pos = stack.pos;
        for (;;) {
            var result = this.advanceStack(stack, null);
            if (!result)
                return stack;
            if (result.pos > pos) {
                this.putStack(result);
                return null;
            }
            stack = result;
        }
    };
    ParseContext.prototype.runRecovery = function (stacks, tokens) {
        var finished = null;
        for (var i = 0; i < stacks.length; i++) {
            var stack = stacks[i], token = tokens[i << 1], tokenEnd = tokens[(i << 1) + 1];
            var base = verbose ? stack + " -> " : "";
            var force = stack.split(), forceBase = base;
            for (var j = 0; force.forceReduce() && j < forceReduceLimit; j++) {
                if (verbose)
                    console.log(forceBase + force + " (via force-reduce)");
                var stopped = this.advanceFully(force);
                if (!stopped)
                    break;
                force = stopped;
                if (verbose)
                    forceBase = stopped + " -> ";
            }
            for (var _i = 0, _a = stack.recoverByInsert(token); _i < _a.length; _i++) {
                var insert = _a[_i];
                if (verbose)
                    console.log(base + insert + " (via recover-insert)");
                this.advanceFully(insert);
            }
            if (stack.cx.input.length > stack.pos) {
                if (tokenEnd == stack.pos) {
                    tokenEnd++;
                    token = 0 /* Err */;
                }
                stack.recoverByDelete(token, tokenEnd);
                if (verbose)
                    console.log(base + stack + (" (via recover-delete " + stack.cx.parser.getName(token) + ")"));
                this.putStack(stack);
            }
            else if (!stack.cx.parent && (!finished || finished.recovered > stack.recovered)) {
                finished = stack;
            }
        }
        return finished;
    };
    /// Force the parse to finish, generating a tree containing the nodes
    /// parsed so far.
    ParseContext.prototype.forceFinish = function () {
        return this.stacks[0].split().forceAll().toTree();
    };
    Object.defineProperty(ParseContext.prototype, "badness", {
        /// A value that indicates how successful the parse is so far, as
        /// the number of error-recovery steps taken divided by the number
        /// of tokens parsed. Could be used to decide to abort a parse when
        /// the input doesn't appear to match the grammar at all.
        get: function () {
            return this.stacks[0].recovered * 2 /* Token */ / this.tokenCount;
        },
        enumerable: true,
        configurable: true
    });
    ParseContext.prototype.scanForNestEnd = function (stack, endToken, filter) {
        var input = stack.cx.input;
        for (var pos = stack.pos; pos < input.length; pos++) {
            dummyToken.start = pos;
            dummyToken.value = -1;
            endToken.token(input, dummyToken, stack);
            if (dummyToken.value > -1 && (!filter || filter(input.read(pos, dummyToken.end))))
                return pos;
        }
        return input.length;
    };
    return ParseContext;
}());
/// A parser holds the parse tables for a given grammar, as generated
/// by `lezer-generator`.
var Parser = /** @class */ (function () {
    /// @internal
    function Parser(
    /// The parse states for this grammar @internal
    states, 
    /// A blob of data that the parse states, as well as some
    /// of `Parser`'s fields, point into @internal
    data, 
    /// The goto table. See `computeGotoTable` in
    /// lezer-generator for details on the format @internal
    goto, 
    /// A node group with the node types used by this parser.
    group, 
    /// The first repeat-related term id @internal
    minRepeatTerm, 
    /// The tokenizer objects used by the grammar @internal
    tokenizers, 
    /// Maps top rule names to [state ID, top term ID] pairs.
    topRules, 
    /// Metadata about nested grammars used in this grammar @internal
    nested, 
    /// Points into this.data at an array of token types that
    /// are specialized @internal
    specializeTable, 
    /// For each specialized token type, this holds an object mapping
    /// names to numbers, with the first bit indicating whether the
    /// specialization extends or replaces the original token, and the
    /// rest of the bits holding the specialized token type. @internal
    specializations, 
    /// Points into this.data at an array that holds the
    /// precedence order (higher precedence first) for ambiguous
    /// tokens @internal
    tokenPrecTable, 
    /// An optional object mapping term ids to name strings @internal
    termNames) {
        if (termNames === void 0) { termNames = null; }
        this.states = states;
        this.data = data;
        this.goto = goto;
        this.group = group;
        this.minRepeatTerm = minRepeatTerm;
        this.tokenizers = tokenizers;
        this.topRules = topRules;
        this.nested = nested;
        this.specializeTable = specializeTable;
        this.specializations = specializations;
        this.tokenPrecTable = tokenPrecTable;
        this.termNames = termNames;
        this.nextStateCache = [];
        this.maxNode = this.group.types.length - 1;
        this.maxRepeatWrap = this.group.types.length + (this.group.types.length - minRepeatTerm) - 1;
        for (var i = 0, l = this.states.length / 6 /* Size */; i < l; i++)
            this.nextStateCache[i] = null;
    }
    /// Parse a given string or stream.
    Parser.prototype.parse = function (input, options) {
        if (typeof input == "string")
            input = new StringStream(input);
        var cx = new ParseContext(this, input, options);
        for (;;) {
            var done = cx.advance();
            if (done)
                return done;
        }
    };
    /// Create a `ParseContext`.
    Parser.prototype.startParse = function (input, options) {
        if (typeof input == "string")
            input = new StringStream(input);
        return new ParseContext(this, input, options);
    };
    /// Get a goto table entry @internal
    Parser.prototype.getGoto = function (state, term, loose) {
        if (loose === void 0) { loose = false; }
        var table = this.goto;
        if (term >= table[0])
            return -1;
        for (var pos = table[term + 1];;) {
            var groupTag = table[pos++], last = groupTag & 1;
            var target = table[pos++];
            if (last && loose)
                return target;
            for (var end = pos + (groupTag >> 1); pos < end; pos++)
                if (table[pos] == state)
                    return target;
            if (last)
                return -1;
        }
    };
    /// Check if this state has an action for a given terminal @internal
    Parser.prototype.hasAction = function (state, terminal) {
        var data = this.data;
        for (var set = 0; set < 2; set++) {
            for (var i = this.stateSlot(state, set ? 2 /* Skip */ : 1 /* Actions */), next = void 0; (next = data[i]) != 65535 /* End */; i += 3) {
                if (next == terminal || next == 0 /* Err */)
                    return data[i + 1] | (data[i + 2] << 16);
            }
        }
        return 0;
    };
    /// @internal
    Parser.prototype.stateSlot = function (state, slot) {
        return this.states[(state * 6 /* Size */) + slot];
    };
    /// @internal
    Parser.prototype.stateFlag = function (state, flag) {
        return (this.stateSlot(state, 0 /* Flags */) & flag) > 0;
    };
    /// @internal
    Parser.prototype.startNested = function (state) {
        var flags = this.stateSlot(state, 0 /* Flags */);
        return flags & 4 /* StartNest */ ? flags >> 10 /* NestShift */ : -1;
    };
    /// @internal
    Parser.prototype.validAction = function (state, action) {
        if (action == this.stateSlot(state, 4 /* DefaultReduce */))
            return true;
        for (var i = this.stateSlot(state, 1 /* Actions */);; i += 3) {
            if (this.data[i] == 65535 /* End */)
                return false;
            if (action == (this.data[i + 1] | (this.data[i + 2] << 16)))
                return true;
        }
    };
    /// Get the states that can follow this one through shift actions or
    /// goto jumps. @internal
    Parser.prototype.nextStates = function (state) {
        var cached = this.nextStateCache[state];
        if (cached)
            return cached;
        var result = [];
        for (var i = this.stateSlot(state, 1 /* Actions */); this.data[i] != 65535 /* End */; i += 3) {
            if ((this.data[i + 2] & (65536 /* ReduceFlag */ >> 16)) == 0 && !result.includes(this.data[i + 1]))
                result.push(this.data[i + 1]);
        }
        var table = this.goto, max = table[0];
        for (var term = 0; term < max; term++) {
            for (var pos = table[term + 1];;) {
                var groupTag = table[pos++], target = table[pos++];
                for (var end = pos + (groupTag >> 1); pos < end; pos++)
                    if (table[pos] == state && !result.includes(target))
                        result.push(target);
                if (groupTag & 1)
                    break;
            }
        }
        return this.nextStateCache[state] = result;
    };
    /// @internal
    Parser.prototype.overrides = function (token, prev) {
        var iPrev = findOffset(this.data, this.tokenPrecTable, prev);
        return iPrev < 0 || findOffset(this.data, this.tokenPrecTable, token) < iPrev;
    };
    /// Create a new `Parser` instance with different values for (some
    /// of) the nested grammars. This can be used to, for example, swap
    /// in a different language for a nested grammar or fill in a nested
    /// grammar that was left blank by the original grammar.
    Parser.prototype.withNested = function (spec) {
        return new Parser(this.states, this.data, this.goto, this.group, this.minRepeatTerm, this.tokenizers, this.topRules, this.nested.map(function (obj) {
            if (!Object.prototype.hasOwnProperty.call(spec, obj.name))
                return obj;
            return { name: obj.name, grammar: spec[obj.name], end: obj.end, placeholder: obj.placeholder };
        }), this.specializeTable, this.specializations, this.tokenPrecTable, this.termNames);
    };
    /// Create a new `Parser` instance whose node types have the given
    /// props added. You should use [`NodeProp.add`](#tree.NodeProp.add)
    /// to create the arguments to this method.
    Parser.prototype.withProps = function () {
        var _a;
        var props = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            props[_i] = arguments[_i];
        }
        return new Parser(this.states, this.data, this.goto, (_a = this.group).extend.apply(_a, props), this.minRepeatTerm, this.tokenizers, this.topRules, this.nested, this.specializeTable, this.specializations, this.tokenPrecTable, this.termNames);
    };
    /// Returns the name associated with a given term. This will only
    /// work for all terms when the parser was generated with the
    /// `--names` option. By default, only the names of tagged terms are
    /// stored.
    Parser.prototype.getName = function (term) {
        return this.termNames ? this.termNames[term] : String(term <= this.maxNode && this.group.types[term].name || term);
    };
    Object.defineProperty(Parser.prototype, "eofTerm", {
        /// The eof term id is always allocated directly after the node
        /// types. @internal
        get: function () { return this.maxRepeatWrap + 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parser.prototype, "hasNested", {
        /// Tells you whether this grammar has any nested grammars.
        get: function () { return this.nested.length > 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parser.prototype, "defaultTop", {
        /// @internal
        get: function () { return this.topRules[Object.keys(this.topRules)[0]]; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Parser.prototype, "topType", {
        /// The node type produced by the default top rule.
        get: function () { return this.group.types[this.defaultTop[1]]; },
        enumerable: true,
        configurable: true
    });
    /// (Used by the output of the parser generator) @internal
    Parser.deserialize = function (spec) {
        var tokenArray = decodeArray(spec.tokenData);
        var nodeNames = spec.nodeNames.split(" "), minRepeatTerm = nodeNames.length;
        for (var i = 0; i < spec.repeatNodeCount; i++)
            nodeNames.push("");
        var nodeProps = [];
        for (var i = 0; i < nodeNames.length; i++)
            nodeProps.push(noProps);
        function setProp(nodeID, prop, value) {
            if (nodeProps[nodeID] == noProps)
                nodeProps[nodeID] = Object.create(null);
            prop.set(nodeProps[nodeID], prop.deserialize(String(value)));
        }
        setProp(0, NodeProp.error, "");
        if (spec.nodeProps)
            for (var _i = 0, _a = spec.nodeProps; _i < _a.length; _i++) {
                var propSpec = _a[_i];
                var prop = propSpec[0];
                for (var i = 1; i < propSpec.length; i += 2)
                    setProp(propSpec[i], prop, propSpec[i + 1]);
            }
        var group = new NodeGroup(nodeNames.map(function (name, i) { return new NodeType(name, nodeProps[i], i); }));
        return new Parser(decodeArray(spec.states, Uint32Array), decodeArray(spec.stateData), decodeArray(spec.goto), group, minRepeatTerm, spec.tokenizers.map(function (value) { return typeof value == "number" ? new TokenGroup(tokenArray, value) : value; }), spec.topRules, (spec.nested || []).map(function (_a) {
            var name = _a[0], grammar = _a[1], endToken = _a[2], placeholder = _a[3];
            return ({ name: name, grammar: grammar, end: new TokenGroup(decodeArray(endToken), 0), placeholder: placeholder });
        }), spec.specializeTable, (spec.specializations || []).map(withoutPrototype), spec.tokenPrec, spec.termNames);
    };
    return Parser;
}());
var noProps = Object.create(null);
function findOffset(data, start, term) {
    for (var i = start, next = void 0; (next = data[i]) != 65535 /* End */; i++)
        if (next == term)
            return i - start;
    return -1;
}
// Strip the prototypes from objects, so that they can safely be
// accessed as maps.
function withoutPrototype(obj) {
    if (!(obj instanceof Object))
        return obj;
    var result = Object.create(null);
    for (var prop in obj)
        if (Object.prototype.hasOwnProperty.call(obj, prop))
            result[prop] = obj[prop];
    return result;
}
function findFinished(stacks) {
    var best = null;
    for (var _i = 0, stacks_1 = stacks; _i < stacks_1.length; _i++) {
        var stack = stacks_1[_i];
        if (stack.pos == stack.cx.input.length &&
            stack.cx.parser.stateFlag(stack.state, 2 /* Accepting */) &&
            (!best || best.recovered > stack.recovered))
            best = stack;
    }
    return best;
}
function finishNested(stack) {
    if (stack.cx.wrapType == -2)
        return null; // Another nested stack already finished
    var parent = stack.cx.parent, tree = stack.forceAll().toTree();
    var parentParser = parent.cx.parser, info = parentParser.nested[parentParser.startNested(parent.state)];
    tree = new Tree(tree.type, tree.children, tree.positions.map(function (p) { return p - parent.pos; }), stack.pos - parent.pos);
    if (stack.cx.wrapType > -1)
        tree = new Tree(parentParser.group.types[stack.cx.wrapType], [tree], [0], tree.length);
    stack.cx.wrapType = -2;
    parent.useNode(tree, parentParser.getGoto(parent.state, info.placeholder, true));
    if (verbose)
        console.log(parent + (" (via unnest " + (stack.cx.wrapType > -1 ? parentParser.getName(stack.cx.wrapType) : tree.type.name) + ")"));
    return parent;
}

// This file was generated by lezer-generator. You probably shouldn't edit it.
const 
  noSemi = 181,
  PostfixOp = 1,
  insertSemi = 182,
  templateContent = 183,
  templateDollarBrace = 184,
  templateEnd = 185;

/* Hand-written tokenizers for JavaScript tokens that can't be
   expressed by lezer's built-in tokenizer. */

const newline = [10, 13, 8232, 8233];
const space = [9, 11, 12, 32, 133, 160, 5760, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199, 8200, 8201, 8202, 8239, 8287, 12288];

const braceR = 125, braceL = 123, semicolon = 59, slash = 47, star = 42,
      plus = 43, minus = 45, dollar = 36, backtick = 96, backslash = 92;

// FIXME this should technically enter block comments
function newlineBefore(input, pos) {
  for (let i = pos - 1; i >= 0; i--) {
    let prev = input.get(i);
    if (newline.includes(prev)) return true
    if (!space.includes(prev)) break
  }
  return false
}

const insertSemicolon = new ExternalTokenizer((input, token, stack) => {
  let pos = token.start, next = input.get(pos);
  if ((next == braceR || next == -1 || newlineBefore(input, pos)) && stack.canShift(insertSemi))
    token.accept(insertSemi, token.start);
}, {contextual: true});

const noSemicolon = new ExternalTokenizer((input, token, stack) => {
  let pos = token.start, next = input.get(pos++);
  if (space.includes(next) || newline.includes(next)) return
  if (next == slash) {
    let after = input.get(pos++);
    if (after == slash || after == star) return
  }
  if (next != braceR && next != semicolon && next != -1 && !newlineBefore(input, token.start) &&
      stack.canShift(noSemi))
    token.accept(noSemi, token.start);
}, {contextual: true});

const postfix = new ExternalTokenizer((input, token, stack) => {
  let pos = token.start, next = input.get(pos++);
  if ((next == plus || next == minus) && next == input.get(pos++) &&
      !newlineBefore(input, token.start) && stack.canShift(PostfixOp))
    token.accept(PostfixOp, pos);
}, {contextual: true});

const template = new ExternalTokenizer((input, token) => {
  let pos = token.start, afterDollar = false;
  for (;;) {
    let next = input.get(pos++);
    if (next < 0) {
      if (pos - 1 > token.start) token.accept(templateContent, pos - 1);
      break
    } else if (next == backtick) {
      if (pos == token.start + 1) token.accept(templateEnd, pos);
      else token.accept(templateContent, pos - 1);
      break
    } else if (next == braceL && afterDollar) {
      if (pos == token.start + 2) token.accept(templateDollarBrace, pos);
      else token.accept(templateContent, pos - 2);
      break
    } else if (next == 10 /* "\n" */ && pos > token.start + 1) {
      // Break up template strings on lines, to avoid huge tokens
      token.accept(templateContent, pos);
      break
    } else if (next == backslash && pos != input.length) {
      pos++;
    }
    afterDollar = next == dollar;
  }
});

// This file was generated by lezer-generator. You probably shouldn't edit it.
const parser = Parser.deserialize({
  states: "!4xOYOSOOO$QOSO'#FvO&{O!lO'#CkO(wOSO'#CrO*sO!lO'#GmOXOO'#Gm'#GmO,oX#tO'#C|O,yOSO'#D]O/tOSO'#DaO1dOSO'#DkOXOO'#Dt'#DtO3YOSO'#DsO3^O!lO'#GjO5cOSO'#E]OXOO'#Gj'#GjOXOO'#Gs'#GsO5gOSO'#FdO5kO!fO'#FeOXOO'#G`'#G`OXOO(3Cx(3CxQXOSOOO/tOSO'#D^O5rOSO'#EbO5vOSO'#ChO6QOSO'#DsO6[OSO'#EcO6fOSO'#CaO7SOSO'#EkO7dOSO'#EnO7kOSO'#EtO7kOSO'#EvOYOSO'#ExO7kOSO'#EzO7kOSO'#E}O7oOSO'#FTO7sO!gO'#FXO/tOSO'#FZO7}O!gO'#F]O8XO!gO'#F`O5kO!fO'#FbOXOO,5<Q,5<QO8cO!lO'#CkO:zOSO'#GgO/tOSO'#GgO;ROSO,59^O;VOSO'#FzO;^OSO(3C|O=VOYO'#GoOXOO'#Go'#GoO>rOSO,59pO>vO`O'#DVO?jOSO'#DtO?}OSO'#GfO@[O!fO'#GeO@oOSO'#DlO5vOSO'#DrO6TOSO'#DsO@yO!fO'#FyO/tOSO'#FiOXOO,59i,59iOAaOSO'#D`OCVO`O,5:bO/tOSO,5:bO/tOSO,5:eO/tOSO,5:eO/tOSO,5:eO/tOSO,5:eO/tOSO,5:eO/tOSO,5:eO/tOSO,5:eO/tOSO,5:eO/tOSO,5:eO/tOSO,5:eO/tOSO,5:eOCZOSO,5:tOXOO,5:y,5:yOXOO,5:z,5:zOXOO,5:{,5:{ODyX#tO'#FxO/tOSO'#GlOXXO(3Cz(3CzOETX#tO,59hOEXOSO'#F{OXOO(3C}(3C}OHSOSO,59wOHWO!lO,59{OJVOSO,5:VO6[OSO'#GdOJZOSO'#GdOJbOSO,59YOJfOSO,5:_O/tOSO,5:wOYOSO,5<OOXOO'#Gc'#GcOXOO,5<P,5<POLUO!lO,59xOXOO'#Ck'#CkONTOSO,5:|OXOO'#Cc'#CcON[OSO'#CnO7oOSO,59SONlOSO,59SO6TOSO,59SONpOSO,5:_O5vOSO,59SONtOSO'#CrO! UO`O'#CvOXOO'#Gf'#GfO! fO!fO,5:}O! pOSO'#EgO! wOSO'#ChO! {OSO,58{O!!POSO,58{OXOO,58{,58{O!#oO!fO,58{O!#yOSO'#EmO!$QOSO'#GuO!$XOSO,5;VO!$]OSO,5;VO5kO!fO,5;VO!$aOSO'#EpOXOO'#Eq'#EqOXOO'#Er'#ErOYOSO,5;YO!&]OSO,5;YO/tOSO'#DkOYOSO,5;`OYOSO,5;bO!&aOSO,5;dOYOSO,5;fO!&eOSO,5;iO!&iOSO,5;oOXOO,5;s,5;sO/tOSO,5;sO5kO!fO,5;uOXOO,5;w,5;wO!)vOSO,5;wOXOO,5;z,5;zO!)vOSO,5;zOXOO,5;|,5;|O!)zOSO'#FwO!*ROSO(3CyOXOO,5=R,5=RO:zOSO,5=RO=VOYO,5=ZOXOO1G.x1G.xOXOO,5<U,5<UO!*fOYO-E9hO/tOSO,5<UOXOO,5=Z,5=ZOXOO1G/[1G/[O!,ROSO'#CxOXOO'#Gq'#GqO/tOSO'#GqO!,lOSO'#GqO!-VOSO'#DWO!-dO`O'#DWOCZOSO'#DWO!-qOSO'#GpO!-xOSO,59qO!-|OSO'#CwO!.ZOSO'#GhO!.bOSO,59bO!.fO`O'#DWO/tOSO,5=PO!.|O`O'#DoOXOO,5:W,5:WO/tOSO,5:WO!/gOSO,5:WO7oOSO,5:^ONlOSO,5:^O6TOSO,5:^OXOO,5<T,5<TO!/nO!lO-E9gO!1mOYO'#GrO/tOSO'#GrO!3YOSO,59zOXOO'#Cx'#CxOXOO1G/|1G/|O!3^OSO1G/|O!3bO!lO1G0PO!5aO!lO1G0PO!7`O!lO1G0PO!9_O!lO1G0PO!;^O!lO1G0PO!=]O!lO1G0PO!?[O!lO1G0PO!AZO!lO1G0PO!CYO!lO1G0PO!EXO!lO1G0PO!GWO!lO1G0PO!IVOrO'#CkOCZOSO'#DaO!KXOSO'#DsO!K]OrO1G0`O!LuOrO'#GjO!NkOSO'#E]OCZOSO'#D^O6TOSO'#DsOXXO,5<S,5<SO!NoO!lO'#GmO#!nOWO,5=WOXOO1G/S1G/SOXOO,5<V,5<VOXOO1G/c1G/cOXOO1G/q1G/qOJZOSO,5=OO#!rOSO'#GQO#!yOSO(3DSOXOO,5=O,5=OOXOO1G.t1G.tOXOO1G/y1G/yO##^O!lO1G0cOXOO1G1j1G1jOXOO1G/d1G/dOXOO1G0h1G0hO/tOSO1G0hOXOO1G.n1G.nO7oOSO1G.nONlOSO1G.nOJfOSO1G/yO6TOSO1G.nO6[OSO'#GgO6[OSO'#CwO#%]O!fO'#GRO6[OSO'#FqO5kO!fO1G0iOXOO'#DO'#DOO#%gOSO'#GtO#%qOSO,5;RO#%uOSO1G.gOXOO1G.g1G.gO5kO!fO1G.gO#%yOSO'#CkO#&TOSO'#GvO#&[OSO,5;XO#&`OSO'#GvO#&dOSO'#GUO#&kOSO(3DWOXOO,5=a,5=aO5rOSO1G0qO#&xOSO1G0qOXOO1G0q1G0qO#&|OYO,5=cO#(rOSO,5=cO#(|OSO,5;[O#*oOSO,5;[O6[OSO,5=cOXOO1G0t1G0tOYOSO1G0tOXOO1G0z1G0zOXOO1G0|1G0|O7kOSO1G1OO#*sOSO1G1QO#-zOSO'#FPOXOO1G1T1G1TO7oOSO1G1ZO#0{OSO1G1ZO5kO!fO1G1_OXOO1G1a1G1aOXOO'#F_'#F_O5kO!fO1G1cO5kO!fO1G1fOXOO,5<R,5<ROXOO-E9e-E9eO6[OSO,5<ROXOO1G2m1G2mOXOO1G2u1G2uO#1SOYO3)/SO#2oOSO,5=]OCZOSO,59cO6[OSO,59cO7oOSO,59rOCZOSO,59rOXOO'#D['#D[ONlOSO,59rO#2sOrO,59rO#4`OSO'#GfOXOO,59c,59cO#4jOSO'#GeO#4tOSO'#F|O#4{O`O(3DOOXOO,5=[,5=[OXOO1G/]1G/]O#5oOSO'#GPO#5vO`O(3DROXOO,5=S,5=SOXOO1G.|1G.|O!-dO`O,59rO#6ZO!lO1G2kO#8PO`O'#GOONlOSO'#DpO!-mO`O'#DpOXOO(3DQ(3DQO#8jOSO,5:ZO#8nO`O'#DpO#8{O`O'#DpO#9]OSO1G/rOXOO1G/r1G/rO/tOSO1G/rOXOO1G/x1G/xO7oOSO1G/xONlOSO1G/xO#9aOSO'#F}O#9hOSO(3DPOXOO,5=^,5=^O!1mOYO,5=^OXOO1G/f1G/fOXOO7+%h7+%hO#;aOrO,59{O#=POSO,5:_OCZOSO,5:eOCZOSO,5:eOCZOSO,5:eOCZOSO,5:eOCZOSO,5:eOCZOSO,5:eOCZOSO,5:eOCZOSO,5:eOCZOSO,5:eOCZOSO,5:eOCZOSO,5:eOCZOSO,5:tO/tOSO7+%zOCZOSO,5:wO#>oOrO,59xO#@_OSO,5:_O#@cO!lO'#FyOXXO1G2r1G2rOXOO1G2j1G2jOXOO,5<[,5<[O6[OSO,5<[OXOO-E9n-E9nO#9]OSO7+&SOXOO7+$Y7+$YO7oOSO7+$YOXOO7+%e7+%eONlOSO7+$YOXOO,5<],5<]OXOO-E9o-E9oOXOO7+&T7+&TO#BbOSO'#GSO#BiOSO(3DUOXOO,5=`,5=`O#BsO`O,5=`OXOO1G0m1G0mO5kO!fO7+$ROXOO7+$R7+$RO#BwOSO'#GTO#COOSO(3DVOXOO,5=b,5=bOXOO1G0s1G0sO5rOSO,5=bOXOO,5<`,5<`OXOO-E9r-E9rO#CYOSO7+&]O5kO!fO7+&]O/tOSO1G2}O/tOSO1G3OO#C^OSO1G0vO#EPOSO1G0vO#ETOSO1G0vO#FvO!fO1G2}OXOO7+&`7+&`O5kO!fO7+&jOYOSO7+&lO#GZOSO'#GVOXOO'#Gy'#GyOXOO(3DX(3DXO#J[OSO,5;kO/tOSO'#FQO#J`OSO'#FSOXOO7+&u7+&uO#JdOSO7+&uO6[OSO7+&uOXOO7+&y7+&yOXOO7+&}7+&}OXOO7+'Q7+'QOXOO3)/P3)/POXOO1G2w1G2wO#MnOrO1G.}O$ ZOSO1G.}OXOO1G/^1G/^O$ eOrO1G/^O7oOSO1G/^OCZOSO,5=POXOO,5<W,5<WOCZOSO'#DWOXOO-E9j-E9jOXOO,5<Z,5<ZOXOO-E9m-E9mONlOSO1G/^OXOO,5<Y,5<YO7oOSO,5:[ONlOSO,5:[OXOO1G/u1G/uO!-mO`O,5:[O$#QO`O,5:[OXOO7+%^7+%^O#9]OSO7+%^OXOO7+%d7+%dO7oOSO7+%dOXOO,5<X,5<XO$#_OYO-E9kO/tOSO,5<XOXOO1G2x1G2xO$$zOrO'#GmO$&jOrO1G0PO$(YOrO1G0PO$)xOrO1G0PO$+hOrO1G0PO$-WOrO1G0PO$.vOrO1G0PO$0fOrO1G0PO$2UOrO1G0PO$3tOrO1G0PO$5dOrO1G0PO$7SOrO1G0PO$8rOrO1G0`O$:[O!lO<<IfO$<ZOrO1G0cO#=POSO1G/yOXOO3)/Y3)/YOXOO<<In<<InOXOO<<Gt<<GtO7oOSO<<GtOXOO,5<^,5<^O$=yOSO-E9pOXOO'#Ei'#EiO$>TOSO1G2zOXOO<<Gm<<GmOXOO,5<_,5<_OXOO-E9q-E9qO$>[OSO,5<_O#&TOSO1G2|O$>`OSO<<IwOXOO<<Iw<<IwO$>dOSO7+(iO$>hOSO7+(jOXOO7+&b7+&bO$>lOSO7+&bO$>pOSO7+&bO$@cOSO7+&bO/tOSO7+(iO/tOSO7+(jOXOO<<JU<<JUOXOO<<JW<<JWOXOO,5<a,5<aOXOO1G1V1G1VO$@gOSO,5;lOXOO,5;n,5;nO7oOSO<<JaO$@kOSO<<JaOCZOSO7+$iOXOO7+$x7+$xO$@oOrO1G2kO7oOSO7+$xOXOO1G/v1G/vO7oOSO1G/vONlOSO1G/vO!-mO`O1G/vOXOO<<Hx<<HxOXOO<<IO<<IOO$B[OYO3)/VO$CwOrO'#FyOCZOSO'#FiOCZOSO7+%zOXOOAN=`AN=`O$EgO`O1G1xOXOO7+(f7+(fO5rOSO1G1yOXOO7+(h7+(hO5kO!fOAN?cOXOO<<LT<<LTOXOO<<LU<<LUOXOO<<I|<<I|O$EkOSO<<I|O$EoOSO<<I|O$GbOSO<<LTO$GfOSO<<LUOXOO1G1W1G1WOXOOAN?{AN?{O7oOSOAN?{O$GjOrO<<HTOXOO<<Hd<<HdOXOO7+%b7+%bO7oOSO7+%bONlOSO7+%bO$IVOrO-E9gO$JuOrO<<IfOXOO'#Ej'#EjOXOO8;$v8;$vOXOO8;$w8;$wOXOOG24}G24}OXOOAN?hAN?hO$LeOSOAN?hOXOOANAoANAoOXOOANApANApO$LiOSOG25gOXOO<<H|<<H|O7oOSO<<H|OXOOG25SG25SO7oOSOLD+ROXOOAN>hAN>hOXOO!$'Nm!$'Nm",
  stateData: "%!OQOSROS%ROS~UjOX^OYbO]hO^gOaXOeROiVOm^Os^Ot^Ou^Ov^Ow^O!ReO!UWO!VWO!WWO!XWO!YWO!ZWO![WO!]WO!^WO!afO#WiO#XiO#YiO#`kO#clO#imO#knO#moO#opO#rqO#xrO#|sO$OtO$QuO$TvO$VwO%TQO%_UO~UjOX^OYbO]hO^gOaXOeROiVOm^Os^Ot^Ou^Ov^Ow^O!ReO!UWO!VWO!WWO!XWO!YWO!ZWO![WO!]WO!^WO!afO#WiO#XiO#YiO#`kO#clO#imO#knO#moO#opO#rqO#xrO#|sO$OtO$QuO$TvO$VwO%TQO%_UO$z$jX~PrXYrXarXerXgrXn$RXorX!^rX!i_X!krX!lrX!nrX!orX!prX!qrX!rrX!srX!trX!urX!vrX!wrX!xrX!yrX!zrX!{rX!}rX#QrX$|rX%_rX~X^O]!YO^!XOaXOc{OeROg!OOi!SOm^Os^Ot^Ou^Ov^Ow^O!ReO!UWO!VWO!WWO!XWO!YWO!ZWO![WO!]WO!^WO!a!WO%TyO%_UOd$nPd%ZP~P!mOa!^Oe!`Og![O!^!cO!k!_O!l!_O!n!aO!o!bO!p!bO!q!bO!r!dO!s!eO!t!eO!u!eO!v!fO!w!gO!x!hO!y!iO!z!jO!{!kO!}!lO%_UOY%aX$|%aX`%aXd%aXi%aXn%aX~$}!rO%O!qO%P$lP~UjOX^OYbO]hO^gOaXOeROiVOm^Os^Ot^Ou^Ov^Ow^O!ReO!UWO!VWO!WWO!XWO!YWO!ZWO![WO!]WO!^WO!afO#WiO#XiO#YiO#`kO#clO#imO#knO#moO#opO#rqO#xrO#|sO$OtO$QuO$TvO$VwO%TQO%_UOh$oP~X^O]!YO^!XOaXOeROi!SOm^Os^Ot^Ou^Ov^Ow^O!ReO!UWO!VWO!WWO!XWO!YWO!ZWO![WO!]WO!^WO!a!WO%TyO%_UO~X^O]!YO^!XOaXOc!yOeROi!SOm^Os^Ot^Ou^Ov^Ow^O!ReO!UWO!VWO!WWO!XWO!YWO!ZWO![WO!]WO!^WO!a!WO%TyO%_UO`%WP~!i!|O~o!}O#Q!}OP%^XY%^Xa%^Xe%^Xg%^X!^%^X!k%^X!l%^X!n%^X!o%^X!p%^X!q%^X!r%^X!s%^X!t%^X!u%^X!v%^X!w%^X!x%^X!y%^X!z%^X!{%^X!}%^X$|%^X%_%^Xd%^X`%^X%b%^Xi%^Xn%^X~o!}O~n#OO~Y#PO$|#PO~%T#SO~a#VO%T#SO%U#UO~^#[Oa#VO%T#SO~e#]Oi#^O%T#SO~Z#dO]#bO^gOi#aO!afO#WiO#XiO#YiO%U#UO~X#kOi#gO%T#SO%U#UOW%iP~a#lO!U#pO~a#qO~iVO~Y#PO${#yO$|#PO~Y#PO${#|O$|#PO~Y#PO${$OO$|#PO~PrXarXd_XdrXerXg_XgrXo_XorX!^rX!i_X!krX!lrX!nrX!orX!prX!qrX!rrX!srX!trX!urX!vrX!wrX!xrX!yrX!zrX!{rX!}rX#QrX%_rXYrX$|rX`_X`rX%brX#grXirXnrX~g$ROd$kP~d$VO~g!OOd$nX~X^O]!YO^!XOaXOc$YOeROi!SOm^Os^Ot^Ou^Ov^Ow^O!ReO!UWO!VWO!WWO!XWO!YWO!ZWO![WO!]WO!^WO!a!WO%TyO%_UOd$^Zg$^Z~P!mOa!^Oe!`Og!OO!^!cO!k!_O!l!_O!n!aO!o!bO!p!bO!q!bO!r!dO!s!eO!t!eO!u!eO!v!fO!w!gO!x!hO!y!iO!z!jO!{!kO!}!lO%_UOd$nP~d$[O~X$`Oc$cOe$_Om$`O{$iO|$bO}$bO%U#UO%]$]Oh%[Ph%dP~d%YXg%YXo%YX!i!hX`%YXh%YX~o!}Od%YXg%YX`%YX~o$jOd%XXg%XX`%XXY%XX$|%XX~i$kO!b$mO%T#SO~g![OY$mX$|$mX`$mXd$mXi$mXn$mX~X^O]!YO^!XOaXOc$uOeROi!SOm^Os^Ot^Ou^Ov^Ow^O!ReO!UWO!VWO!WWO!XWO!YWO!ZWO![WO!]WO!^WO!a!WO%TyO%_UO`%fP~%]$wO~X^O]%^O^!XOaXOeROi!SOm^Os^Ot^Ou^Ov^Ow^O!R%]O!U%WO!V%WO!W%WO!X%WO!Y%WO!Z%WO![%WO!]%WO!^%WO!a!WO%T%VO%_UO~$}!rO%O!qO%P$lX~%P%bO~UjOX^OYbO]hO^gOaXOeROiVOm^Os^Ot^Ou^Ov^Ow^O!ReO!UWO!VWO!WWO!XWO!YWO!ZWO![WO!]WO!^WO!afO#WiO#XiO#YiO#`kO#clO#imO#knO#moO#opO#rqO#xrO#|sO$OtO$QuO$TvO$VwO%TQO%_UOh$oX~h%dO~a!^Oe!`O!k!_O!l!_O%_UOP!TaY!Tag!Ta!^!Ta!n!Ta!o!Ta!p!Ta!q!Ta!r!Ta!s!Ta!t!Ta!u!Ta!v!Ta!w!Ta!x!Ta!y!Ta!z!Ta!{!Ta!}!Ta$|!Tad!Ta`!Ta%b!Tai!Tan!Ta~`%eO~g%hO`$tP~`%jO~X^O]!YO^!XOaXOeROiVOm^Os^Ot^Ou^Ov^Ow^O!ReO!UWO!VWO!WWO!XWO!YWO!ZWO![WO!]WO!^WO!a!WO%TyO%_UO~P!mOa!^Oe!`O!^!cO!k!_O!l!_O!n!aO!o!bO!p!bO!q!bO!r!dO!s!eO!t!eO!u!eO!v!fO!w!gO!x!hO!y!iO!z!jO!{!kO!}!lO%_UOY!Qag!Qa$|!Qad!Qa`!Qa%b!Qai!Qan!Qa~i$kO!b%pO~c!yOe#]Oi#^O%T#SO`%WP~a#VO~!i%tO~c%vOe#]Oi#^O%T#SOd%ZP~X$fOc%wOm$fO%]$wOh%[P~g%yOY$uP$|$uP~%T%{Oh%hP~^#[O~W&OO~X^O]hO^gOaXOeROi!SOm^Os^Ot^Ou^Ov^Ow^O!ReO!UWO!VWO!WWO!XWO!YWO!ZWO![WO!]WO!^WO!afO%TyO%_UO~W&OOY#PO$|#PO~%T&ROh%jP~g&WOW$xP~#[&YO~W&ZO~X^OY&_O]!YO^!XOaXOeROi!SOm^Os^Ot^Ou^Ov^Ow^O!ReO!UWO!VWO!WWO!XWO!YWO!ZWO![WO!]WO!^WO!a!WO#W&aO#X&aO#Y&aO%TyO%_UO~a#lO~#i&fO~i&hO~#y&kO#z&jOU#waX#waY#wa]#wa^#waa#wae#wai#wam#was#wat#wau#wav#waw#wa!R#wa!U#wa!V#wa!W#wa!X#wa!Y#wa!Z#wa![#wa!]#wa!^#wa!a#wa#W#wa#X#wa#Y#wa#`#wa#c#wa#i#wa#k#wa#m#wa#o#wa#r#wa#x#wa#|#wa$O#wa$Q#wa$T#wa$V#wa$z#wa%T#wa%_#wah#wa#p#waZ#wa#u#wa~%T&nO~g$ROd$kX~c&sOe#]Oi#^O%T#SOd$ZZg$ZZ~P!mOa!^Oe!`O!^!cO!k!_O!l!_O!n!aO!o!bO!p!bO!q!bO!r!dO!s!eO!t!eO!u!eO!v!fO!w!gO!x!hO!y!iO!z!jO!{!kO!}!lO%_UOd$^cg$^c~a!OXglXg!OXhlXh!OXnlXn!OXolX~n&yOo&xOa%eXgkXg%eXhkXh%eXn%eX~a#VOn&{OgzXhzX~X$^Oe$_Om$^O%]&|O~g'TOh$pP~h'VO~n&yOo&xOgkXhkX~g'XOh$sP~h'ZO~X$^Oe$_Om$^O|'[O}'[O%U#UO%]&|O~Y'aO{'cO|'`O}'`O!e'dO%U#UO%]&|Oh$rP~i$kO!b'gO~P!mOa!^Oe!`O!^!cO!k!_O!l!_O!n!aO!o!bO!p!bO!q!bO!r!dO!s!eO!t!eO!u!eO!v!fO!w!gO!x!hO!y!iO!z!jO!{!kO!}!lO%_UOY$]cg$]c$|$]c`$]cd$]c%b$]ci$]cn$]c~P!mOa!^Oe!`Og'lO!^!cO!k!_O!l!_O!n!aO!o!bO!p!bO!q!bO!r!dO!s!eO!t!eO!u!eO!v!fO!w!gO!x!hO!y!iO!z!jO!{!kO!}!lO%_UO`$qP~`'oO~d'pO~P!mOa!^Oe!`O!k!_O!l!_O%_UOY!mig!mi!^!mi!n!mi!o!mi!p!mi!q!mi!r!mi!s!mi!t!mi!u!mi!v!mi!w!mi!x!mi!y!mi!z!mi!{!mi!}!mi$|!mid!mi`!mi%b!mii!min!mi~P!mOa!^Oe!`O!k!_O!l!_O!n!aO%_UOY!mig!mi!^!mi!o!mi!p!mi!q!mi!r!mi!s!mi!t!mi!u!mi!v!mi!w!mi!x!mi!y!mi!z!mi!{!mi!}!mi$|!mid!mi`!mi%b!mii!min!mi~P!mOa!^Oe!`O!k!_O!l!_O!n!aO!o!bO!p!bO!q!bO%_UOY!mig!mi!^!mi!r!mi!s!mi!t!mi!u!mi!v!mi!w!mi!x!mi!y!mi!z!mi!{!mi!}!mi$|!mid!mi`!mi%b!mii!min!mi~P!mOa!^Oe!`O!^!cO!k!_O!l!_O!n!aO!o!bO!p!bO!q!bO%_UOY!mig!mi!r!mi!s!mi!t!mi!u!mi!v!mi!w!mi!x!mi!y!mi!z!mi!{!mi!}!mi$|!mid!mi`!mi%b!mii!min!mi~P!mOa!^Oe!`O!^!cO!k!_O!l!_O!n!aO!o!bO!p!bO!q!bO!r!dO%_UOY!mig!mi!s!mi!t!mi!u!mi!v!mi!w!mi!x!mi!y!mi!z!mi!{!mi!}!mi$|!mid!mi`!mi%b!mii!min!mi~P!mOa!^Oe!`O!^!cO!k!_O!l!_O!n!aO!o!bO!p!bO!q!bO!r!dO!s!eO!t!eO!u!eO%_UOY!mig!mi!v!mi!w!mi!x!mi!y!mi!z!mi!{!mi!}!mi$|!mid!mi`!mi%b!mii!min!mi~P!mOa!^Oe!`O!^!cO!k!_O!l!_O!n!aO!o!bO!p!bO!q!bO!r!dO!s!eO!t!eO!u!eO!v!fO%_UOY!mig!mi!w!mi!x!mi!y!mi!z!mi!{!mi!}!mi$|!mid!mi`!mi%b!mii!min!mi~P!mOa!^Oe!`O!^!cO!k!_O!l!_O!n!aO!o!bO!p!bO!q!bO!r!dO!s!eO!t!eO!u!eO!v!fO!w!gO%_UOY!mig!mi!x!mi!y!mi!z!mi!{!mi!}!mi$|!mid!mi`!mi%b!mii!min!mi~P!mOa!^Oe!`O!^!cO!k!_O!l!_O!n!aO!o!bO!p!bO!q!bO!r!dO!s!eO!t!eO!u!eO!v!fO!w!gO!x!hO%_UOY!mig!mi!y!mi!z!mi!{!mi!}!mi$|!mid!mi`!mi%b!mii!min!mi~P!mOa!^Oe!`O!^!cO!k!_O!l!_O!n!aO!o!bO!p!bO!q!bO!r!dO!s!eO!t!eO!u!eO!v!fO!w!gO!x!hO!y!iO%_UOY!mig!mi!z!mi!{!mi!}!mi$|!mid!mi`!mi%b!mii!min!mi~P!mOa!^Oe!`O!^!cO!k!_O!l!_O!n!aO!o!bO!p!bO!q!bO!r!dO!s!eO!t!eO!u!eO!v!fO!w!gO!x!hO!y!iO!z!jO%_UOY!mig!mi!{!mi!}!mi$|!mid!mi`!mi%b!mii!min!mi~PrXarXerXorX!^rX!i_X!krX!lrX!nrX!orX!prX!qrX!rrX!srX!trX!urX!vrX!wrX!xrX!yrX!zrX!{rX!}rX#OrX#QrX%_rXg_XgrXh_XhrXo_X~!i'rO~P!mOa!^Oe!`O!^'uO!k!_O!l!_O!n'sO!o'tO!p'tO!q'tO!r'vO!s'wO!t'wO!u'wO!v'xO!w'yO!x'zO!y'{O!z'|O!{'}O!}(OO#O(PO%_UO~o(QO#Q(QOP%^Xa%^Xe%^X!^%^X!k%^X!l%^X!n%^X!o%^X!p%^X!q%^X!r%^X!s%^X!t%^X!u%^X!v%^X!w%^X!x%^X!y%^X!z%^X!{%^X!}%^X#O%^X%_%^Xg%^Xh%^X~o(QO~P!mOa!^Oe!`Og![O!^!cO!k!_O!l!_O!n!aO!o!bO!p!bO!q!bO!r!dO!s!eO!t!eO!u!eO!v!fO!w!gO!x!hO!y!iO!z!jO!{!kO!}!lO%_UO%b%aXY%aX$|%aXd%aX`%aXi%aXn%aX~%b(UO~g%hO`$tX~c(XOe#]Oi#^O%T#SO`$dZg$dZ~P!mOa!^Oe!`O!^!cO!k!_O!l!_O!n!aO!o!bO!p!bO!q!bO!r!dO!s!eO!t!eO!u!eO!v!fO!w!gO!x!hO!y!iO!z!jO!{!kO!}!lO%_UOY#Pig#Pi$|#Pid#Pi`#Pi%b#Pii#Pin#Pi~g%yOY$uX$|$uX~g(dO#[(fOh$vP~h(gO~X(hO~g_Xh_X#[rX~g(kOh$wP~h(mO~#[(nO~g&WOW$xX~i#gO%T#SOW$hZg$hZ~X(rO~o!}O!t(sO#Q!}O#g(tOP%^XY%^Xa%^Xe%^Xg%^X!^%^X!k%^X!l%^X!n%^X!o%^X!p%^X!q%^X!r%^X!s%^X!u%^X!v%^X!w%^X!x%^X!y%^X!z%^X!{%^X!}%^X%_%^X~o!}O!t(sO#g(tO~X^OY(uO]!YO^!XOaXOeROi!SOm^Os^Ot^Ou^Ov^Ow^O!ReO!UWO!VWO!WWO!XWO!YWO!ZWO![WO!]WO!^WO!a!WO%TyO%_UO~Y(wO~#p({OU#niX#niY#ni]#ni^#nia#nie#nii#nim#nis#nit#niu#niv#niw#ni!R#ni!U#ni!V#ni!W#ni!X#ni!Y#ni!Z#ni![#ni!]#ni!^#ni!a#ni#W#ni#X#ni#Y#ni#`#ni#c#ni#i#ni#k#ni#m#ni#o#ni#r#ni#x#ni#|#ni$O#ni$Q#ni$T#ni$V#ni$z#ni%T#ni%_#nih#niZ#ni#u#ni~UjOX^OYbOZ)RO]hO^gOaXOeROiVOm^Os^Ot^Ou^Ov^Ow^O!ReO!UWO!VWO!WWO!XWO!YWO!ZWO![WO!]WO!^WO!afO#WiO#XiO#YiO#`kO#clO#imO#knO#moO#opO#rqO#u)QO#xrO#|sO$OtO$QuO$TvO$VwO%TQO%_UOh$yP~a)UOiVO~P!mOa!^Oe!`O!^!cO!k!_O!l!_O!n!aO!o!bO!p!bO!q!bO!r!dO!s!eO!t!eO!u!eO!v!fO!w!gO!x!hO!y!iO!z!jO!{!kO!}!lO%_UOd$^kg$^k~d)ZO~P!mOa!^Oe!`O!^'uO!k!_O!l!_O!n'sO!o'tO!p'tO!q'tO!r'vO!s'wO!t'wO!u'wO!v'xO!w'yO!x'zO!y'{O!z'|O!{'}O!}(OO%_UOgzahza~o(QOg%YXh%YX~o)aOg%XXh%XX~g'TOh$pX~X$^Oc)cOe$_Om$^O{$iO|$bO}$bO%U#UO%]&|Og$`Zh$`Z~g'XOh$sX~X$fOc%wOm$fO%]$wOg$cZh$cZ~P!mOa!^Oe!`O!^!cO!k!_O!l!_O!n!aO!o!bO!p!bO!q!bO!r!dO!s!eO!t!eO!u!eO!v!fO!w!gO!x!hO!y!iO!z!jO!{!kO!}!lO%_UOd%Xig%Xi`%XiY%Xi$|%Xi~Y'aO{'cO|'`O}'`O!e'dO%U#UO%]&|Oh$rX~h)kO~|)lO})lO%U#UO%]&|O~{)mO|)lO})lO%U#UO%]&|O~i$kO~g'lO`$qX~X^O]!YO^!XOaXOc)tOeROi!SOm^Os^Ot^Ou^Ov^Ow^O!ReO!UWO!VWO!WWO!XWO!YWO!ZWO![WO!]WO!^WO!a!WO%TyO%_UO`$aZg$aZ~a!^Oe!`O!k!_O!l!_O%_UOP!Ta!^!Ta!n!Ta!o!Ta!p!Ta!q!Ta!r!Ta!s!Ta!t!Ta!u!Ta!v!Ta!w!Ta!x!Ta!y!Ta!z!Ta!{!Ta!}!Ta#O!Tag!Tah!Ta~X^O]%^O^!XOaXOeROiVOm^Os^Ot^Ou^Ov^Ow^O!R%]O!U%WO!V%WO!W%WO!X%WO!Y%WO!Z%WO![%WO!]%WO!^%WO!a!WO%T%VO%_UO~P!mOa!^Oe!`O!^'uO!k!_O!l!_O!n'sO!o'tO!p'tO!q'tO!r'vO!s'wO!t'wO!u'wO!v'xO!w'yO!x'zO!y'{O!z'|O!{'}O!}(OO%_UO#O!Qag!Qah!Qa~!i*VO~g![O%b$mXP$mXY$mXa$mXe$mX!^$mX!k$mX!l$mX!n$mX!o$mX!p$mX!q$mX!r$mX!s$mX!t$mX!u$mX!v$mX!w$mX!x$mX!y$mX!z$mX!{$mX!}$mX$|$mX%_$mXd$mX`$mXi$mXn$mX~g(dOh$vX~%T%{Og$fZh$fZ~%]*^O~g(kOh$wX~%T&ROg$gZh$gZ~W*eO~X^O]!YO^!XO`*iOaXOeROi!SOm^Os^Ot^Ou^Ov^Ow^O!ReO!UWO!VWO!WWO!XWO!YWO!ZWO![WO!]WO!^WO!a!WO%TyO%_UO~Y*kO~X^OY*kO]!YO^!XOaXOeROi!SOm^Os^Ot^Ou^Ov^Ow^O!ReO!UWO!VWO!WWO!XWO!YWO!ZWO![WO!]WO!^WO!a!WO%TyO%_UO~o$jO!t*mO#g*nOY%XXg%XX$|%XX~UjOX^OYbOZ)RO]hO^gOaXOeROiVOm^Os^Ot^Ou^Ov^Ow^O!ReO!UWO!VWO!WWO!XWO!YWO!ZWO![WO!]WO!^WO!afO#WiO#XiO#YiO#`kO#clO#imO#knO#moO#opO#rqO#u)QO#xrO#|sO$OtO$QuO$TvO$VwO%TQO%_UOh$yX~h*rO~n*tO~#z*uOU#wqX#wqY#wq]#wq^#wqa#wqe#wqi#wqm#wqs#wqt#wqu#wqv#wqw#wq!R#wq!U#wq!V#wq!W#wq!X#wq!Y#wq!Z#wq![#wq!]#wq!^#wq!a#wq#W#wq#X#wq#Y#wq#`#wq#c#wq#i#wq#k#wq#m#wq#o#wq#r#wq#x#wq#|#wq$O#wq$Q#wq$T#wq$V#wq$z#wq%T#wq%_#wqh#wq#p#wqZ#wq#u#wq~P!mOa!^Oe!`O!^'uO!k!_O!l!_O!n'sO!o'tO!p'tO!q'tO!r'vO!s'wO!t'wO!u'wO!v'xO!w'yO!x'zO!y'{O!z'|O!{'}O!}(OO%_UOgkihki~o*wOgkihki~P!mOa!^Oe!`O!^'uO!k!_O!l!_O!n'sO!o'tO!p'tO!q'tO!r'vO!s'wO!t'wO!u'wO!v'xO!w'yO!x'zO!y'{O!z'|O!{'}O!}(OO%_UOgzihzi~|+OO}+OO%U#UO%]&|O~P!mOa!^Oe!`O!^!cO!k!_O!l!_O!n!aO!o!bO!p!bO!q!bO!r!dO!s!eO!t!eO!u!eO!v!fO!w!gO!x!hO!y!iO!z!jO!{!kO!}!lO%_UO`$acg$ac~P!mOa!^Oe!`Og+TO!^'uO!k!_O!l!_O!n'sO!o'tO!p'tO!q'tO!r'vO!s'wO!t'wO!u'wO!v'xO!w'yO!x'zO!y'{O!z'|O!{'}O!}(OO%_UO#O%aXh%aX~P!mOa!^Oe!`O!k!_O!l!_O%_UO!^!mi!n!mi!o!mi!p!mi!q!mi!r!mi!s!mi!t!mi!u!mi!v!mi!w!mi!x!mi!y!mi!z!mi!{!mi!}!mi#O!mig!mih!mi~P!mOa!^Oe!`O!k!_O!l!_O!n'sO%_UO!^!mi!o!mi!p!mi!q!mi!r!mi!s!mi!t!mi!u!mi!v!mi!w!mi!x!mi!y!mi!z!mi!{!mi!}!mi#O!mig!mih!mi~P!mOa!^Oe!`O!k!_O!l!_O!n'sO!o'tO!p'tO!q'tO%_UO!^!mi!r!mi!s!mi!t!mi!u!mi!v!mi!w!mi!x!mi!y!mi!z!mi!{!mi!}!mi#O!mig!mih!mi~P!mOa!^Oe!`O!^'uO!k!_O!l!_O!n'sO!o'tO!p'tO!q'tO%_UO!r!mi!s!mi!t!mi!u!mi!v!mi!w!mi!x!mi!y!mi!z!mi!{!mi!}!mi#O!mig!mih!mi~P!mOa!^Oe!`O!^'uO!k!_O!l!_O!n'sO!o'tO!p'tO!q'tO!r'vO%_UO!s!mi!t!mi!u!mi!v!mi!w!mi!x!mi!y!mi!z!mi!{!mi!}!mi#O!mig!mih!mi~P!mOa!^Oe!`O!^'uO!k!_O!l!_O!n'sO!o'tO!p'tO!q'tO!r'vO!s'wO!t'wO!u'wO%_UO!v!mi!w!mi!x!mi!y!mi!z!mi!{!mi!}!mi#O!mig!mih!mi~P!mOa!^Oe!`O!^'uO!k!_O!l!_O!n'sO!o'tO!p'tO!q'tO!r'vO!s'wO!t'wO!u'wO!v'xO%_UO!w!mi!x!mi!y!mi!z!mi!{!mi!}!mi#O!mig!mih!mi~P!mOa!^Oe!`O!^'uO!k!_O!l!_O!n'sO!o'tO!p'tO!q'tO!r'vO!s'wO!t'wO!u'wO!v'xO!w'yO%_UO!x!mi!y!mi!z!mi!{!mi!}!mi#O!mig!mih!mi~P!mOa!^Oe!`O!^'uO!k!_O!l!_O!n'sO!o'tO!p'tO!q'tO!r'vO!s'wO!t'wO!u'wO!v'xO!w'yO!x'zO%_UO!y!mi!z!mi!{!mi!}!mi#O!mig!mih!mi~P!mOa!^Oe!`O!^'uO!k!_O!l!_O!n'sO!o'tO!p'tO!q'tO!r'vO!s'wO!t'wO!u'wO!v'xO!w'yO!x'zO!y'{O%_UO!z!mi!{!mi!}!mi#O!mig!mih!mi~P!mOa!^Oe!`O!^'uO!k!_O!l!_O!n'sO!o'tO!p'tO!q'tO!r'vO!s'wO!t'wO!u'wO!v'xO!w'yO!x'zO!y'{O!z'|O%_UO!{!mi!}!mi#O!mig!mih!mi~P!mOa!^Oe!`O!^'uO!k!_O!l!_O!n'sO!o'tO!p'tO!q'tO!r'vO!s'wO!t'wO!u'wO!v'xO!w'yO!x'zO!y'{O!z'|O!{'}O!}(OO#O+UO%_UO~P!mOa!^Oe!`O!^!cO!k!_O!l!_O!n!aO!o!bO!p!bO!q!bO!r!dO!s!eO!t!eO!u!eO!v!fO!w!gO!x!hO!y!iO!z!jO!{!kO%_UOY!|yg!|y!}!|y$|!|yd!|y`!|y%b!|yi!|yn!|y~P!mOa!^Oe!`O!^'uO!k!_O!l!_O!n'sO!o'tO!p'tO!q'tO!r'vO!s'wO!t'wO!u'wO!v'xO!w'yO!x'zO!y'{O!z'|O!{'}O!}(OO%_UO#O#Pig#Pih#Pi~#[+WOg$fch$fc~g(dOh$vP~#[+YO~X+[O~`+]O~`+^O~`+_O~X^O]!YO^!XO`+_OaXOeROi!SOm^Os^Ot^Ou^Ov^Ow^O!ReO!UWO!VWO!WWO!XWO!YWO!ZWO![WO!]WO!^WO!a!WO%TyO%_UO~Y+aO~n+dO~`+fO~P!mOa!^Oe!`O!^'uO!k!_O!l!_O!n'sO!o'tO!p'tO!q'tO!r'vO!s'wO!t'wO!u'wO!v'xO!w'yO!x'zO!y'{O!z'|O!{'}O!}(OO%_UOg%Xih%Xi~P!mOa!^Oe!`O!^!cO!k!_O!l!_O!n!aO!o!bO!p!bO!q!bO!r!dO!s!eO!t!eO!u!eO!v!fO!w!gO!x!hO!y!iO!z!jO!{!kO!}!lO%_UO`$akg$ak~g+TOP$mXa$mXe$mX!^$mX!k$mX!l$mX!n$mX!o$mX!p$mX!q$mX!r$mX!s$mX!t$mX!u$mX!v$mX!w$mX!x$mX!y$mX!z$mX!{$mX!}$mX#O$mX%_$mXh$mX~%]+nO~`+rO~X^O]!YO^!XO`+rOaXOeROi!SOm^Os^Ot^Ou^Ov^Ow^O!ReO!UWO!VWO!WWO!XWO!YWO!ZWO![WO!]WO!^WO!a!WO%TyO%_UO~`+tO~`+uO~P!mOa!^Oe!`O!^'uO!k!_O!l!_O!n'sO!o'tO!p'tO!q'tO!r'vO!s'wO!t'wO!u'wO!v'xO!w'yO!x'zO!y'{O!z'|O!{'}O!}(OO%_UOgkyhky~P!mOa!^Oe!`O!^'uO!k!_O!l!_O!n'sO!o'tO!p'tO!q'tO!r'vO!s'wO!t'wO!u'wO!v'xO!w'yO!x'zO!y'{O!z'|O!{'}O!}(OO%_UOg$]c#O$]ch$]c~P!mOa!^Oe!`O!^'uO!k!_O!l!_O!n'sO!o'tO!p'tO!q'tO!r'vO!s'wO!t'wO!u'wO!v'xO!w'yO!x'zO!y'{O!z'|O!{'}O%_UO!}!|y#O!|yg!|yh!|y~`+yO~#z+zOU#w!ZX#w!ZY#w!Z]#w!Z^#w!Za#w!Ze#w!Zi#w!Zm#w!Zs#w!Zt#w!Zu#w!Zv#w!Zw#w!Z!R#w!Z!U#w!Z!V#w!Z!W#w!Z!X#w!Z!Y#w!Z!Z#w!Z![#w!Z!]#w!Z!^#w!Z!a#w!Z#W#w!Z#X#w!Z#Y#w!Z#`#w!Z#c#w!Z#i#w!Z#k#w!Z#m#w!Z#o#w!Z#r#w!Z#x#w!Z#|#w!Z$O#w!Z$Q#w!Z$T#w!Z$V#w!Z$z#w!Z%T#w!Z%_#w!Zh#w!Z#p#w!ZZ#w!Z#u#w!Z~R%]Q%T%R!ow~%T%]~",
  goto: "!&S%nPPPPP%oP&PPPPP&rPP'WPP*iPPP-qPPP-q0Y0aPPP0i3o4kPPPPP6z6z8yPPP9P9h6zP;`6zPPPPPPPPP<i6zPP>w?ZP6z6z?_PAgPP6zPPPPPPPPPPPPPP6zPP6zP6z6z6z&rCjPPPDOPDRDU%oPDX%oPD_D_D_P%oP%oP%oP%oPP%oPDeDhPDh%oPPP%oP%oP%oPDl%oP%oP%o%oESEYEaEgEuE}FTFZFbFhFnFuF{GSGZGaGgGjGpGsGxHRHUHXH_HbHeHkHnHtHzH}PPPPPPPPIQPPIvJ{KPKwLeLiPLmP!!t!!xP!$t!$w!$z!%V!%Y!%m!%p!%s!%v!%z!&OmbOPVo!t#O#o#r#s#u&c&h({(|Q#YgQ#cjQ#ikS$b!S'TQ$q!XQ%u#[Q'[$iS'`$k'^S)l'c'dR+O)mn_OPVjo!t#O#o#r#s#u&c&h({(|R&P#d$vYOPVWehot!O!Y![!^!`!a!b!c!d!e!f!g!h!i!j!k!l!q!t!|!}#O#d#l#o#q#r#s#u#y$Y$_$j$m$u%W%]%^%p%t&_&c&h&x&{'g'l'r's't'u'v'w'x'y'z'{'|'}(O(P(Q(s(t(u(w({(|)Q)a)c)t*V*k*m*n*w+T+U+aW!TRX{$cQ#TfQ#Xgl#_i!y#V#]$R%h%v%w%y&a&s&y(X)UQ#hkQ$n!WQ$p!XS%s#Y#[Q&S#gQ'j$qQ(_%uQ(p&WQ(q&YQ*b(kQ*d(nR+p+Y#rZOPRVWXeot{!O![!^!`!a!b!c!d!e!f!g!h!i!j!k!q!t!|!}#O#d#l#o#q#r#s#u#y$Y$_$j$m$u%p%t&_&c&h'g'l(P(s(t(u(w({(|)Q)t*k*m*n+aQ#WgS#Zh!YQ$o!X!U%X!l$c%W%]&x&{'r's't'u'v'w'x'y'z'{'|'}(O(Q)a)c*V*w+T+UU%r#X#Y#[Q&z$aS'i$p$qQ(S%^S(]%s%uQ)`&}Q)i'_Q)q'jQ*Z(_Q*z)gQ*|)jQ+j*}R+x+k#j]OPVWeot!O![!^!`!a!b!c!d!e!f!g!h!i!j!k!q!t!|!}#O#d#o#q#r#s#u#y$Y$_$j$m$u%p%t&_&c&h'g'l(P(s(t(u(w({(|)Q)t*k*m*n+aU!URX{l#_i!y#V#]$R%h%v%w%y&a&s&y(X)U!S%[!l%W%]&x&{'r's't'u'v'w'x'y'z'{'|'}(O(Q)a)c*V*w+T+UQ&^#lR'P$cS$g!S#^R)f'XU$f!S#^'XR$x!_$x^OPRVWXeot{!O![!^!`!a!b!c!d!e!f!g!h!i!j!k!l!q!t!|!}#O#d#l#o#q#r#s#u#y$Y$_$c$j$m$u%W%]%p%t&_&c&h&x&{'g'l'r's't'u'v'w'x'y'z'{'|'}(O(P(Q(s(t(u(w({(|)Q)a)c)t*V*k*m*n*w+T+U+a#Z!oS!P!w#R$U$X$s$t$z${$|$}%O%P%Q%R%S%T%U%Y%`%l&v'O']'n'q(R)[)_)s)v)w)x)y)z){)|)}*O*P*Q*R*S*T*U*y+R+g+l+m!sTOPVXot!`!q!t!|#O#d#l#o#q#r#s#u#y$_$m%p%t&_&c&h'g'r(s(t(u(w({(|)Q*V*k*m*n+a#p[OPRVWXeot{!O![!^!`!a!b!c!d!e!f!g!h!i!j!k!q!t!|!}#O#d#o#q#r#s#u#y$Y$_$j$m$u%p%t&_&c&h'g'l(P(s(t(u(w({(|)Q)t*k*m*n+a!U%Z!l$c%W%]&x&{'r's't'u'v'w'x'y'z'{'|'}(O(Q)a)c*V*w+T+UQ%|#aQ&U#gQ&]#lQ*](dR*c(k$y^OPRVWXeot{!O![!^!`!a!b!c!d!e!f!g!h!i!j!k!l!q!t!|!}#O#d#l#o#q#r#s#u#y$Y$_$c$j$m$u%W%]%p%t&_&c&h&x&{'g'l'r's't'u'v'w'x'y'z'{'|'}(O(P(Q(s(t(u(w({(|)Q)a)c)t*V*k*m*n*w+T+U+aQ$d!SR)d'TY$^!S$b$i'T'[S'_$k'^U)j'`'c'dS*})l)mR+k+OlbOPVo!t#O#o#r#s#u&c&h({(|Q#wrS%k!|'rQ%q#WQ'h$oQ([%rS(^%t*VQ)S&jQ)T&kQ)^&zQ)p'iQ*Y(]Q*x)`Q*{)iQ+Q)qQ+V*ZQ+e*uQ+h*zQ+i*|Q+v+fQ+w+jQ+{+xR+|+z#U!nS!P!w$U$X$s$t$z${$|$}%O%P%Q%R%S%T%U%Y%`%l&v'O']'n'q)[)_)s)v)w)x)y)z){)|)}*O*P*Q*R*S*T*U*y+R+g+l+mT%n#R(R$x^OPRVWXeot{!O![!^!`!a!b!c!d!e!f!g!h!i!j!k!l!q!t!|!}#O#d#l#o#q#r#s#u#y$Y$_$c$j$m$u%W%]%p%t&_&c&h&x&{'g'l'r's't'u'v'w'x'y'z'{'|'}(O(P(Q(s(t(u(w({(|)Q)a)c)t*V*k*m*n*w+T+U+aQ#rmQ#snQ#upQ#vqR(z&fQ$l!WQ%o#TQ'f$nQ)n'eQ*X(ZR+P)oT'a$k'^#rZOPRVWXeot{!O![!^!`!a!b!c!d!e!f!g!h!i!j!k!q!t!|!}#O#d#l#o#q#r#s#u#y$Y$_$j$m$u%p%t&_&c&h'g'l(P(s(t(u(w({(|)Q)t*k*m*n+aS#Zh!Y!U%X!l$c%W%]&x&{'r's't'u'v'w'x'y'z'{'|'}(O(Q)a)c*V*w+T+UR(S%^#p[OPRVWXeot{!O![!^!`!a!b!c!d!e!f!g!h!i!j!k!q!t!|!}#O#d#o#q#r#s#u#y$Y$_$j$m$u%p%t&_&c&h'g'l(P(s(t(u(w({(|)Q)t*k*m*n+a!U%Z!l$c%W%]&x&{'r's't'u'v'w'x'y'z'{'|'}(O(Q)a)c*V*w+T+UR&]#ln_OPVjo!t#O#o#r#s#u&c&h({(|R&_#lR#fjR*_(fR+o+WQ#hkR(p&WQ#olR&c#pR&i#vT(}&h(|l`OPVo!t#O#o#r#s#u&c&h({(|Q&o#|R&p$OQPORxPS$Qz$TR&q$QQ!pUR%_!pQ!ZSU$r!Z(T+SQ(T%`R+S)vU}R!P$UR$W}Q!tVR%c!tQ'S$dR)b'SS'k$t'nR)r'kQ'^$kR)h'^Q'W$gR)e'WS%g!z%fR(W%gQ%x#`R(`%xS(c%|*_R*[(cS(j&S*dR*a(jQ&V#hR(o&VQ(|&hR*q(|RdOQ$SzR&t$TR!sUV!]S%`)vQ!QRQ$Z!PR&u$UR!vVR'U$dQ'm$tR)u'nR'b$kR'Y$gQ%i!zR(V%fR%z#`Q(e%|R+X*_Q(l&SR+Z*dR&X#hR)P&hScOPS!uV!tQ#toQ%m#OQ&b#oQ&d#rQ&e#sQ&g#uQ(y&cS(}&h(|R*p({Q#QaQ#xsQ#{uQ#}vQ$PwQ&P#fQ&[#kQ&m#zQ(b%zQ(i&QQ)V&lQ)W&oQ)X&pQ*`(hQ*f(rQ*o(zR+q+[T!{X#VSzR#]S!zX#VS#`i&aS$T{%vQ%f!yQ&r$RS'Q$c%wQ(Y%hQ(a%yQ)Y&sR*W(Xj!VRXi{!y#V#]$R%h%v%y&s(XS'R$c%wQ(x&aQ)]&yR*v)UT|R#]T$h!S#^!hSOPVXot!`!t#O#d#l#o#q#r#s#u#y$_$m%p&_&c&h'g(s(t(u(w({(|)Q*k*m*n+aQ!PRQ!wWQ#ReQ$U{Q$X!OQ$s![Q$t!^Q$z!aQ${!bQ$|!cQ$}!dQ%O!eQ%P!fQ%Q!gQ%R!hQ%S!iQ%T!jQ%U!kQ%Y!lU%`!q!|%tQ%l!}Q&v$YS'O$c)cQ']$jQ'n$uQ'q%WQ(R%]Q)[&xQ)_&{Q)s'lS)v'r*VQ)w'sQ)x'tQ)y'uQ)z'vQ){'wQ)|'xQ)}'yQ*O'zQ*P'{Q*Q'|Q*R'}Q*S(OQ*T(PQ*U(QQ*y)aQ+R)tQ+g*wQ+l+TR+m+UT!rU!plaOPVo!t#O#o#r#s#u&c&h({(|S!xX#qQ#ztQ$y!`Q%a!qS%k!|'rQ&Q#dQ&`#lQ&l#yQ&w$_Q'e$mQ(Z%pS(^%t*VQ(v&_Q)o'gQ*g(sQ*h(tQ*j(uQ*l(wQ*s)QQ+`*kQ+b*mQ+c*nR+s+aR!RRR$e!SS$a!S'TS&}$b$iR)g'[R$v!^lbOPVo!t#O#o#r#s#u&c&h({(|R#ejR%}#aR#jkR&T#gT#ml#pT#nl#pT)O&h(|",
  nodeNames: "⚠ PostfixOp LineComment BlockComment Script ExportDeclaration export Star from String ; default FunctionDeclaration async function VariableDefinition ) ( ParamList Spread ] [ ArrayPattern , } { ObjectPattern PatternProperty PropertyName Number : Equals TemplateString SequenceExpression VariableName BooleanLiteral this null super RegExp ArrayExpression ObjectExpression Property async get set PropertyNameDefinition Block NewExpression new ArgList UnaryExpression await yield void typeof delete LogicOp BitOp ArithOp ArithOp ParenthesizedExpression ClassExpression class extends ClassBody MethodDeclaration static FunctionExpression ArrowFunction ParamList Arrow MemberExpression . ?. BinaryExpression ArithOp ArithOp ArithOp ArithOp BitOp CompareOp in instanceof CompareOp BitOp BitOp BitOp LogicOp LogicOp ConditionalExpression LogicOp LogicOp AssignmentExpression UpdateOp PostfixExpression CallExpression TaggedTemplatExpression ClassDeclaration VariableDeclaration let var const ExportGroup as VariableName VariableName ImportDeclaration import ImportGroup ForStatement for ForSpec ForInSpec ForOfSpec of WhileStatement while WithStatement with DoStatement do IfStatement if else SwitchStatement switch SwitchBody CaseLabel case DefaultLabel TryStatement try catch finally ReturnStatement return ThrowStatement throw BreakStatement break Label ContinueStatement continue DebuggerStatement debugger LabeledStatement ExpressionStatement",
  nodeProps: [
    [NodeProp.top, 4,true],
    [NodeProp.openedBy, 16,"(",20,"[",24,"{"],
    [NodeProp.closedBy, 17,")",21,"]",25,"}"]
  ],
  repeatNodeCount: 16,
  tokenData: "=R~R!SX^$_pq$_qr%Srs%itu&]uv&vvw'Twx'exy(Syz(Xz{(^{|(s|})T}!O)Y!O!P)e!P!Q*u!Q!R5i!R![6c![!]8S!]!^8Z!^!_8`!_!`8x!`!a9b!a!b9x!c!}&]!}#O:_#P#Q:d#Q#R:i#R#S&]#S#T:q#T#o&]#o#p:v#p#q:{#q#r;W#r#s;_#y#z$_$f$g$_$g#BY&]#BY#BZ;d#BZ$IS&]$IS$I_;d$I_$I|&]$I|$JO;d$JO$JT&]$JT$JU;d$JU$KV&]$KV$KW;d$KW&FU&]&FU&FV;d&FV~&]~$dY%R~X^$_pq$_#y#z$_$f$g$_#BY#BZ$_$IS$I_$_$I|$JO$_$JT$JU$_$KV$KW$_&FU&FV$_Z%XP!ZP!_!`%[Y%aP!vY!_!`%dY%iO!vY~%nUX~OY%iZr%irs&Qs#O%i#O#P&V#P~%i~&VOX~~&YPO~%i_&dU%]S%TZtu&]!Q![&]!c!}&]#R#S&]#T#o&]$g~&]~&{P!p~!_!`'OY'TO#QY~'YQ!y~vw'`!_!`'O~'eO!z~~'jUX~OY'eZw'ewx&Qx#O'e#O#P'|#P~'e~(PPO~'e~(XOa~~(^O`~_(eQ%UT!qYz{(k!_!`'OY(pP!nY!_!`'O~(xQ!^~{|)O!_!`'O~)TO!]~~)YOg~~)_Q!^~}!O)O!_!`'O_)jQ!kY!O!P)p!Q![){T)sP!O!P)vT){OcTT*QRmT!Q![){!g!h*Z#X#Y*ZT*^R{|*g}!O*g!Q![*mT*jP!Q![*mT*rPmT!Q![*m~*zZ!oYOY+mZz+mz{-f{!P+m!P!Q3z!Q!_+m!_!`4V!`!}+m!}#O4s#O#P5`#P~+mP+rVwPOY+mZ!P+m!P!Q,X!Q!}+m!}#O,p#O#P-]#P~+mP,^UwP#Z#[,X#]#^,X#a#b,X#g#h,X#i#j,X#m#n,XP,sTOY,pZ#O,p#O#P-S#P#Q+m#Q~,pP-VQOY,pZ~,pP-`QOY+mZ~+m~-kYwPOY-fYZ.ZZz-fz{/O{!P-f!P!Q2v!Q!}-f!}#O0^#O#P2d#P~-f~.^ROz.Zz{.g{~.Z~.jTOz.Zz{.g{!P.Z!P!Q.y!Q~.Z~/OOR~~/TYwPOY-fYZ.ZZz-fz{/O{!P-f!P!Q/s!Q!}-f!}#O0^#O#P2d#P~-f~/zUR~wP#Z#[,X#]#^,X#a#b,X#g#h,X#i#j,X#m#n,X~0aWOY0^YZ.ZZz0^z{0y{#O0^#O#P2Q#P#Q-f#Q~0^~0|YOY0^YZ.ZZz0^z{0y{!P0^!P!Q1l!Q#O0^#O#P2Q#P#Q-f#Q~0^~1qTR~OY,pZ#O,p#O#P-S#P#Q+m#Q~,p~2TTOY0^YZ.ZZz0^z{0y{~0^~2gTOY-fYZ.ZZz-fz{/O{~-f~2{_wPOz.Zz{.g{#Z.Z#Z#[2v#[#].Z#]#^2v#^#a.Z#a#b2v#b#g.Z#g#h2v#h#i.Z#i#j2v#j#m.Z#m#n2v#n~.Z~4PQQ~OY3zZ~3zZ4^V#QYwPOY+mZ!P+m!P!Q,X!Q!}+m!}#O,p#O#P-]#P~+mP4vTOY4sZ#O4s#O#P5V#P#Q+m#Q~4sP5YQOY4sZ~4sP5cQOY+mZ~+mT5nVmT!O!P6T!Q![6c!g!h*Z#U#V6t#X#Y*Z#c#d7Y#l#m7hT6YRmT!Q![6T!g!h*Z#X#Y*ZT6hSmT!O!P6T!Q![6c!g!h*Z#X#Y*ZT6wQ!Q!R6}!R!S6}T7SQmT!Q!R6}!R!S6}T7]P!Q!Y7`T7ePmT!Q!Y7`T7kR!Q![7t!c!i7t#T#Z7tT7yRmT!Q![7t!c!i7t#T#Z7tZ8ZOnR#OW~8`OY~~8eQ!s~!^!_8k!_!`8s~8pP!r~!_!`'O~8xO!s~~8}Qo~!_!`9T!`!a9]Y9YP!vY!_!`%d~9bO!i~~9gQ!s~!_!`8s!`!a9m~9rQ!r~!_!`'O!`!a8k~9}Q!}~!O!P:T!a!b:Y~:YO!l~~:_O!{~~:dOe~~:iOd~~:nP!x~!_!`'O~:vO%_~~:{Oi~~;QQ!w~!_!`'O#p#q:Y_;_Oh]%bQ~;dO![~~;mf%]S%TZ%R~X^$_pq$_tu&]!Q![&]!c!}&]#R#S&]#T#o&]#y#z$_$f$g$_$g#BY&]#BY#BZ;d#BZ$IS&]$IS$I_;d$I_$I|&]$I|$JO;d$JO$JT&]$JT$JU;d$JU$KV&]$KV$KW;d$KW&FU&]&FU&FV;d&FV~&]",
  tokenizers: [noSemicolon, postfix, 0, 1, 2, 3, insertSemicolon, template],
  topRules: {"Script":[0,4]},
  specializeTable: 8507,
  specializations: [{export:12, from:17, default:22, async:27, function:28, true:70, false:70, this:72, null:74, super:76, new:98, await:105, yield:107, void:108, typeof:110, delete:112, class:126, extends:128, in:164, instanceof:166, let:200, var:202, const:204, as:209, import:216, for:222, of:231, while:234, with:238, do:242, if:246, else:248, switch:252, case:258, try:264, catch:266, finally:268, return:272, throw:276, break:280, continue:286, debugger:290},
   {async:87, get:89, set:91, static:135}],
  tokenPrec: 8499
});

/// A syntax tree node prop used to associate indentation strategies
/// with node types. Such a strategy is a function from an indentation
/// context to a number. That number may be -1, to indicate that no
/// definitive indentation can be determined, or a column number to
/// which the given line should be indented.
const indentNodeProp = new NodeProp();
function syntaxIndentation(syntax) {
    return EditorState.indentation.of((cx, pos) => {
        return computeIndentation(cx, syntax.getTree(cx.state), pos);
    });
}
// Compute the indentation for a given position from the syntax tree.
function computeIndentation(cx, ast, pos) {
    let tree = ast.resolve(pos);
    // Enter previous nodes that end in empty error terms, which means
    // they were broken off by error recovery, so that indentation
    // works even if the constructs haven't been finished.
    for (let scan = tree, scanPos = pos;;) {
        let last = scan.childBefore(scanPos);
        if (!last)
            break;
        if (last.type.prop(NodeProp.error) && last.start == last.end) {
            tree = scan;
            scanPos = last.start;
        }
        else {
            scan = last;
            scanPos = scan.end + 1;
        }
    }
    for (; tree; tree = tree.parent) {
        let strategy = indentStrategy(tree);
        if (strategy)
            return strategy(new TreeIndentContext(cx, pos, tree));
    }
    return -1;
}
function indentStrategy(tree) {
    let strategy = tree.type.prop(indentNodeProp);
    if (strategy)
        return strategy;
    let first = tree.firstChild, close;
    if (first && (close = first.type.prop(NodeProp.closedBy))) {
        let last = tree.lastChild, closed = last && close.indexOf(last.name) > -1;
        return cx => delimitedStrategy(cx, true, 1, undefined, closed ? last.start : undefined);
    }
    return tree.parent == null ? topIndent : null;
}
function topIndent() { return 0; }
/// Objects of this type provide context information and helper
/// methods to indentation functions.
class TreeIndentContext extends IndentContext {
    /// @internal
    constructor(base, 
    /// The position at which indentation is being computed.
    pos, 
    /// The syntax tree node for which the indentation strategy is
    /// registered.
    node) {
        super(base.state, base.overrideIndentation, base.simulateBreak);
        this.pos = pos;
        this.node = node;
    }
    /// Get the text directly after `this.pos`, either the entire line
    /// or the next 100 characters, whichever is shorter.
    get textAfter() {
        return this.textAfterPos(this.pos);
    }
    /// Get the indentation at the reference line for `this.node`, which
    /// is the line on which it starts, unless there is a node that is
    /// _not_ a parent of this node covering the start of that line. If
    /// so, the line at the start of that node is tried, again skipping
    /// on if it is covered by another such node.
    get baseIndent() {
        let line = this.state.doc.lineAt(this.node.start);
        // Skip line starts that are covered by a sibling (or cousin, etc)
        for (;;) {
            let atBreak = this.node.resolve(line.start);
            while (atBreak.parent && atBreak.parent.start == atBreak.start)
                atBreak = atBreak.parent;
            if (isParent(atBreak, this.node))
                break;
            line = this.state.doc.lineAt(atBreak.start);
        }
        return this.lineIndent(line);
    }
}
function isParent(parent, of) {
    for (let cur = of; cur; cur = cur.parent)
        if (parent == cur)
            return true;
    return false;
}
// Check whether a delimited node is aligned (meaning there are
// non-skipped nodes on the same line as the opening delimiter). And
// if so, return the opening token.
function bracketedAligned(context) {
    let tree = context.node;
    let openToken = tree.childAfter(tree.start), last = tree.lastChild;
    if (!openToken || context.simulateBreak == openToken.end)
        return null;
    let openLine = context.state.doc.lineAt(openToken.start);
    for (let pos = openToken.end;;) {
        let next = tree.childAfter(pos);
        if (!next || next == last)
            return null;
        if (!next.type.prop(NodeProp.skipped))
            return next.start < openLine.end ? openToken : null;
        pos = next.end;
    }
}
function delimitedStrategy(context, align, units, closing, closedAt) {
    let after = context.textAfter, space = after.match(/^\s*/)[0].length;
    let closed = closing && after.slice(space, space + closing.length) == closing || closedAt == context.pos + space;
    let aligned = align ? bracketedAligned(context) : null;
    if (aligned)
        return closed ? context.column(aligned.start) : context.column(aligned.end);
    return context.baseIndent + (closed ? 0 : context.unit * units);
}
/// An indentation strategy that aligns a node content to its base
/// indentation.
const flatIndent = (context) => context.baseIndent;
/// Creates an indentation strategy that, by default, indents
/// continued lines one unit more than the node's base indentation.
/// You can provide `except` to prevent indentation of lines that
/// match a pattern (for example `/^else\b/` in `if`/`else`
/// constructs), and you can change the amount of units used with the
/// `units` option.
function continuedIndent({ except, units = 1 } = {}) {
    return (context) => {
        let matchExcept = except && except.test(context.textAfter);
        return context.baseIndent + (matchExcept ? 0 : units * context.unit);
    };
}

/// This node prop is used to associate folding information with node
/// types. Given a subtree, it should check whether that tree is
/// foldable and return the range that can be collapsed when it is.
const foldNodeProp = new NodeProp();
function syntaxFolding(syntax) {
    return EditorState.foldable.of((state, start, end) => {
        let inner = syntax.getTree(state).resolve(end);
        let found = null;
        for (let cur = inner; cur; cur = cur.parent) {
            if (cur.end <= end || cur.start > end)
                continue;
            if (found && cur.start < start)
                break;
            let prop = cur.type.prop(foldNodeProp);
            if (prop) {
                let value = prop(cur, state);
                if (value && value.from <= end && value.from >= start && value.to > end)
                    found = value;
            }
        }
        return found;
    });
}

/// A [syntax provider](#state.Syntax) based on a
/// [Lezer](https://lezer.codemirror.net) parser.
class LezerSyntax {
    /// Create a syntax instance for the given parser. You'll usually
    /// want to use the
    /// [`withProps`](https://lezer.codemirror.net/docs/ref/#lezer.Parser.withProps)
    /// method to register CodeMirror-specific syntax node props in the
    /// parser, before passing it to this constructor.
    constructor(parser) {
        this.parser = parser;
        let setSyntax = StateEffect.define();
        this.field = StateField.define({
            create(state) { return SyntaxState.advance(Tree.empty, parser, state.doc); },
            update(value, tr, state) { return value.apply(tr, state, parser, setSyntax); }
        });
        this.extension = [
            EditorState.syntax.of(this),
            this.field,
            ViewPlugin.define(view => new HighlightWorker(view, this, setSyntax)),
            syntaxIndentation(this),
            syntaxFolding(this)
        ];
    }
    getTree(state) {
        return state.field(this.field).tree;
    }
    parsePos(state) {
        return state.field(this.field).upto;
    }
    ensureTree(state, upto, timeout = 100) {
        let field = state.field(this.field);
        if (field.upto >= upto)
            return field.updatedTree;
        if (!field.parse)
            field.startParse(this.parser, state.doc);
        if (field.parse.pos < upto) {
            let done = work(field.parse, timeout, upto);
            if (done)
                return field.stopParse(done, state.doc.length);
        }
        return field.parse.pos < upto ? null : field.stopParse();
    }
    get docNodeType() { return this.parser.topType; }
    docNodeTypeAt(state, pos) {
        let type = this.docNodeType;
        if (this.parser.hasNested) {
            let tree = this.getTree(state);
            let target = tree.resolve(pos);
            while (target) {
                if (target.type.prop(NodeProp.top))
                    return target.type;
                target = target.parent;
            }
        }
        return type;
    }
}
class DocStream {
    constructor(doc, length = doc.length) {
        this.doc = doc;
        this.length = length;
        this.cursorPos = 0;
        this.string = "";
        this.cursor = doc.iter();
    }
    get(pos) {
        if (pos >= this.length)
            return -1;
        let stringStart = this.cursorPos - this.string.length;
        if (pos < stringStart || pos >= this.cursorPos) {
            if (pos < this.cursorPos) { // Reset the cursor if we have to go back
                this.cursor = this.doc.iter();
                this.cursorPos = 0;
            }
            this.string = this.cursor.next(pos - this.cursorPos).value;
            this.cursorPos = pos + this.string.length;
            stringStart = this.cursorPos - this.string.length;
        }
        return this.string.charCodeAt(pos - stringStart);
    }
    read(from, to) {
        let stringStart = this.cursorPos - this.string.length;
        if (from < stringStart || to >= this.cursorPos)
            return this.doc.sliceString(from, to);
        else
            return this.string.slice(from - stringStart, to - stringStart);
    }
    clip(at) {
        return new DocStream(this.doc, at);
    }
}
function work(parse, time, upto = 5000000 /* MaxPos */) {
    let endTime = Date.now() + time;
    for (;;) {
        let done = parse.advance();
        if (done)
            return done;
        if (parse.pos > upto || Date.now() > endTime)
            return null;
    }
}
function takeTree(parse, base) {
    let parsed = parse.forceFinish();
    let cache = parsed.applyChanges([{ fromA: parse.pos, toA: parsed.length, fromB: parse.pos, toB: parsed.length }])
        .append(base.applyChanges([{ fromA: 0, toA: parse.pos, fromB: 0, toB: parse.pos }]));
    return { parsed, cache };
}
class SyntaxState {
    constructor(
    // The current tree. Immutable, because directly accessible from
    // the editor state.
    tree, 
    // The point upto which the document has been parsed.
    upto, 
    // The tree that can be used as cache for further incremental
    // parsing. May differ from tree/updatedTree if a parse is broken
    // off halfway—in that case, this one will have nodes that touch
    // the break-off point dropped/decomposed so that they don't get
    // incorrectly reused. The other properties will have those nodes,
    // since they may be useful for code consuming the tree.
    cache) {
        this.tree = tree;
        this.upto = upto;
        this.cache = cache;
        // In-progress parse, if any
        this.parse = null;
        this.updatedTree = tree;
    }
    static advance(cache, parser, doc) {
        let parse = parser.startParse(new DocStream(doc), { cache });
        let done = work(parse, 25 /* Apply */);
        if (done)
            return new SyntaxState(done, doc.length, done);
        let result = takeTree(parse, cache);
        return new SyntaxState(result.parsed, parse.pos, result.cache);
    }
    apply(tr, newState, parser, effect) {
        for (let e of tr.effects)
            if (e.is(effect))
                return e.value;
        if (!tr.docChanged)
            return this;
        let ranges = [];
        tr.changes.iterChangedRanges((fromA, toA, fromB, toB) => ranges.push({ fromA, toA, fromB, toB }));
        return SyntaxState.advance((this.parse ? takeTree(this.parse, this.updatedTree).cache : this.cache).applyChanges(ranges), parser, newState.doc);
    }
    startParse(parser, doc) {
        this.parse = parser.startParse(new DocStream(doc), { cache: this.cache });
    }
    stopParse(tree, upto) {
        if (!tree)
            ({ parsed: tree, cache: this.cache } = takeTree(this.parse, this.updatedTree));
        else
            this.cache = tree;
        this.updatedTree = tree;
        this.upto = upto !== null && upto !== void 0 ? upto : this.parse.pos;
        this.parse = null;
        return tree;
    }
}
let requestIdle = typeof window != "undefined" && window.requestIdleCallback ||
    ((callback, { timeout }) => setTimeout(callback, timeout));
let cancelIdle = typeof window != "undefined" && window.cancelIdleCallback || clearTimeout;
// FIXME figure out some way to back off from full re-parses when the
// document is large—you could waste a lot of battery re-parsing a
// multi-megabyte document every time you insert a backtick, even if
// it happens in the background.
class HighlightWorker {
    constructor(view, syntax, setSyntax) {
        this.view = view;
        this.syntax = syntax;
        this.setSyntax = setSyntax;
        this.working = -1;
        this.work = this.work.bind(this);
        this.scheduleWork();
    }
    update(update) {
        if (update.docChanged)
            this.scheduleWork();
    }
    scheduleWork() {
        if (this.working > -1)
            return;
        let { state } = this.view, field = state.field(this.syntax.field);
        if (field.upto >= state.doc.length)
            return;
        this.working = requestIdle(this.work, { timeout: 200 /* Pause */ });
    }
    work(deadline) {
        this.working = -1;
        let { state } = this.view, field = state.field(this.syntax.field);
        if (field.upto >= state.doc.length)
            return;
        if (!field.parse)
            field.startParse(this.syntax.parser, state.doc);
        let done = work(field.parse, deadline ? Math.max(25 /* MinSlice */, deadline.timeRemaining()) : 100 /* Slice */);
        if (done || field.parse.badness > .8) {
            let tree = field.stopParse(done, state.doc.length);
            this.view.dispatch(state.update({
                effects: this.setSyntax.of(new SyntaxState(tree, state.doc.length, field.cache))
            }));
        }
        else {
            this.scheduleWork();
        }
    }
    destroy() {
        if (this.working >= 0)
            cancelIdle(this.working);
    }
}

const Inherit = 1;
/// A tag system defines a set of node (token) tags used for
/// highlighting. You'll usually want to use the
/// [default](#highlight.defaultTags) set, but it is possible to
/// define your own custom system when that doesn't fit your use case.
class TagSystem {
    /// Define a tag system. Each tag identifies a type of syntactic
    /// element, which can have a single type and any number of flags.
    /// The `flags` argument should be an array of flag names, and the
    /// `types` argument an array of type names. Type names may have a
    /// `"name=parentName"` format to specify that this type is an
    /// instance of some other type, which means that, if no styling for
    /// the type itself is provided, it'll fall back to the parent
    /// type's styling.
    ///
    /// You can specify a `subtypes` property to assign a given number
    /// of sub-types to each type. These are automatically generated
    /// types with the base type name suffixed with `#1` to `#`_`N`_
    /// (where _N_ is the number given in the `subtypes` field) that
    /// have the base type as parent type.
    constructor(options) {
        /// @internal
        this.typeNames = [""];
        /// @internal
        this.typeIDs = Object.create(null);
        /// A [node
        /// prop](https://lezer.codemirror.net/docs/ref#tree.NodeProp) used
        /// to associate styling tag information with syntax tree nodes.
        this.prop = new NodeProp();
        this.flags = options.flags;
        this.types = options.types;
        this.flagMask = Math.pow(2, this.flags.length) - 1;
        this.typeShift = this.flags.length;
        let subtypes = options.subtypes || 0;
        let parentNames = [undefined];
        this.typeIDs[""] = 0;
        let typeID = 1;
        for (let type of options.types) {
            let match = /^([\w\-]+)(?:=([\w-]+))?$/.exec(type);
            if (!match)
                throw new RangeError("Invalid type name " + type);
            let id = typeID++;
            this.typeNames[id] = match[1];
            this.typeIDs[match[1]] = id;
            parentNames[id] = match[2];
            for (let i = 0; i < subtypes; i++) {
                let subID = typeID++, name = match[1] + "#" + (i + 1);
                this.typeNames[subID] = name;
                this.typeIDs[name] = subID;
                parentNames[subID] = match[1];
            }
        }
        this.parents = parentNames.map(name => {
            if (name == null)
                return 0;
            let id = this.typeIDs[name];
            if (id == null)
                throw new RangeError(`Unknown parent type '${name}' specified`);
            return id;
        });
        if (this.flags.length > 29 || this.typeNames.length > Math.pow(2, 29 - this.flags.length))
            throw new RangeError("Too many style tag flags to fit in a 30-bit integer");
    }
    /// Parse a tag name into a numeric ID. Only necessary if you are
    /// manually defining [node properties](#highlight.TagSystem.prop)
    /// for this system.
    get(name) {
        let value = name.charCodeAt(0) == 43 ? 1 : 0; // Check for leading '+'
        for (let part of (value ? name.slice(1) : name).split(" "))
            if (part) {
                let flag = this.flags.indexOf(part);
                if (flag > -1) {
                    value += 1 << flag;
                }
                else {
                    let typeID = this.typeIDs[part];
                    if (typeID == null)
                        throw new RangeError(`Unknown tag type '${part}'`);
                    if (value >> this.typeShift)
                        throw new RangeError(`Multiple tag types specified in '${name}'`);
                    value += typeID << this.typeShift;
                }
            }
        return value;
    }
    /// Create a
    /// [`PropSource`](https://lezer.codemirror.net/docs/ref#tree.PropSource)
    /// that adds node properties for this system. `tags` should map
    /// node type
    /// [selectors](https://lezer.codemirror.net/docs/ref#tree.NodeType^match)
    /// to tag names.
    add(tags) {
        let match = NodeType.match(tags);
        return this.prop.add((type) => {
            let found = match(type);
            return found == null ? undefined : this.get(found);
        });
    }
    /// Create a highlighter extension for this system, styling the
    /// given tags using the given CSS objects.
    highlighter(spec) {
        let styling = new Styling(this, spec);
        return [
            ViewPlugin.define(view => new Highlighter(view, this.prop, styling)).decorations(),
            EditorView.styleModule.of(styling.module)
        ];
    }
    /// @internal
    specificity(tag) {
        let flags = tag & this.flagMask, spec = 0;
        for (let i = 1; i <= this.flags.length; i++)
            if (flags & (1 << i))
                spec++;
        for (let type = tag >> (this.flags.length + 1); type; type = this.parents[type])
            spec += 1000;
        return spec;
    }
}
/// The set of highlighting tags used by regular language packages and
/// themes.
const defaultTags = new TagSystem({
    flags: ["invalid", "meta", "standard",
        "definition", "constant", "local", "control",
        "link", "strong", "emphasis", "monospace",
        "changed", "inserted", "deleted"],
    subtypes: 7,
    types: [
        "comment",
        "lineComment=comment",
        "blockComment=comment",
        "docComment=comment",
        "name",
        "variableName=name",
        "typeName=name",
        "propertyName=name",
        "className=name",
        "labelName=name",
        "namespace=name",
        "literal",
        "string=literal",
        "docString=string",
        "character=string",
        "number=literal",
        "integer=number",
        "float=number",
        "regexp=literal",
        "escape=literal",
        "color=literal",
        "content",
        "heading=content",
        "list=content",
        "quote=content",
        "keyword",
        "self=keyword",
        "null=keyword",
        "atom=keyword",
        "unit=keyword",
        "modifier=keyword",
        "operatorKeyword=keyword",
        "operator",
        "derefOperator=operator",
        "arithmeticOperator=operator",
        "logicOperator=operator",
        "bitwiseOperator=operator",
        "compareOperator=operator",
        "updateOperator=operator",
        "typeOperator=operator",
        "punctuation",
        "separator=punctuation",
        "bracket=punctuation",
        "angleBracket=bracket",
        "squareBracket=bracket",
        "paren=bracket",
        "brace=bracket"
    ]
});
/// Used to add a set of tags to a language syntax via
/// [`Parser.withProps`](https://lezer.codemirror.net/docs/ref#lezer.Parser.withProps).
/// The argument object can use syntax node selectors (see
/// [`NodeType.match`](https://lezer.codemirror.net/docs/ref#tree.NodeType^match))
/// as property names, and tag names (in the [default tag
/// system](#highlight.defaultTags)) as values.
const styleTags = (tags) => defaultTags.add(tags);
/// Create a highlighter theme that adds the given styles to the given
/// tags. The spec's property names must be [tag
/// names](#highlight.defaultTags) or comma-separated lists of tag
/// names. The values should be
/// [`style-mod`](https://github.com/marijnh/style-mod#documentation)
/// style objects that define the CSS for that tag.
const highlighter = (spec) => defaultTags.highlighter(spec);
class StyleRule {
    constructor(type, flags, specificity, cls) {
        this.type = type;
        this.flags = flags;
        this.specificity = specificity;
        this.cls = cls;
    }
}
class Styling {
    constructor(tags, spec) {
        this.tags = tags;
        this.cache = Object.create(null);
        let modSpec = Object.create(null);
        let nextCls = 0;
        let rules = [];
        for (let prop in spec) {
            let cls = "c" + nextCls++;
            modSpec[cls] = spec[prop];
            for (let part of prop.split(/\s*,\s*/)) {
                let tag = tags.get(part);
                rules.push(new StyleRule(tag >> tags.typeShift, tag & tags.flagMask, tags.specificity(tag), cls));
            }
        }
        this.rules = rules.sort((a, b) => b.specificity - a.specificity);
        this.module = new StyleModule(modSpec);
    }
    match(tag) {
        let known = this.cache[tag];
        if (known != null)
            return known;
        let result = "";
        let type = tag >> this.tags.typeShift, flags = tag & this.tags.flagMask;
        for (;;) {
            for (let rule of this.rules) {
                if (rule.type == type && (rule.flags & flags) == rule.flags) {
                    if (result)
                        result += " ";
                    result += this.module[rule.cls];
                    flags &= ~rule.flags;
                    if (type)
                        break;
                }
            }
            if (type)
                type = this.tags.parents[type];
            else
                break;
        }
        return this.cache[tag] = result;
    }
}
class Highlighter {
    constructor(view, prop, styling) {
        this.prop = prop;
        this.styling = styling;
        this.tree = view.state.tree;
        this.decorations = this.buildDeco(view.visibleRanges, this.tree);
    }
    update(update) {
        let syntax = update.state.facet(EditorState.syntax);
        if (!syntax.length) {
            this.decorations = Decoration.none;
        }
        else if (syntax[0].parsePos(update.state) < update.view.viewport.to) {
            this.decorations = this.decorations.map(update.changes);
        }
        else if (this.tree != syntax[0].getTree(update.state) || update.viewportChanged) {
            this.tree = syntax[0].getTree(update.state);
            this.decorations = this.buildDeco(update.view.visibleRanges, this.tree);
        }
    }
    buildDeco(ranges, tree) {
        let builder = new RangeSetBuilder();
        let start = 0;
        function flush(pos, style) {
            if (pos > start && style)
                builder.add(start, pos, Decoration.mark({ class: style })); // FIXME cache these
            start = pos;
        }
        for (let { from, to } of ranges) {
            start = from;
            // The current node's own classes
            let curClass = "";
            let context = [];
            let inherited = [];
            tree.iterate({
                from, to,
                enter: (type, start) => {
                    let inheritedClass = inherited.length ? inherited[inherited.length - 1] : "";
                    let cls = inheritedClass;
                    let style = type.prop(this.prop);
                    if (style != null) {
                        let val = this.styling.match(style);
                        if (val) {
                            if (cls)
                                cls += " ";
                            cls += val;
                        }
                        if (style & Inherit)
                            inheritedClass = cls;
                    }
                    context.push(cls);
                    if (inheritedClass)
                        inherited.push(inheritedClass);
                    if (cls != curClass) {
                        flush(start, curClass);
                        curClass = cls;
                    }
                },
                leave: (_t, _s, end) => {
                    context.pop();
                    inherited.pop();
                    let backTo = context.length ? context[context.length - 1] : "";
                    if (backTo != curClass) {
                        flush(Math.min(to, end), curClass);
                        curClass = backTo;
                    }
                }
            });
        }
        return builder.finish();
    }
}
/// A default highlighter (works well with light themes).
const defaultHighlighter = highlighter({
    deleted: { textDecoration: "line-through" },
    inserted: { textDecoration: "underline" },
    link: { textDecoration: "underline" },
    strong: { fontWeight: "bold" },
    emphasis: { fontStyle: "italic" },
    invalid: { color: "#f00" },
    keyword: { color: "#708" },
    atom: { color: "#219" },
    number: { color: "#164" },
    string: { color: "#a11" },
    "regexp, escape": { color: "#e40" },
    "variableName definition": { color: "#00f" },
    typeName: { color: "#085" },
    className: { color: "#167" },
    "propertyName definition": { color: "#00c" },
    comment: { color: "#940" },
    meta: { color: "#555" },
});

const statementIndent = continuedIndent({ except: /^{/ });
/// A syntax provider based on the [Lezer JavaScript
/// parser](https://github.com/lezer-parser/javascript), extended with
/// highlighting and indentation information.
const javascriptSyntax = new LezerSyntax(parser.withProps(languageData.add({
    Script: {
        closeBrackets: { brackets: ["(", "[", "{", "'", '"', "`"] },
        commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    }
}), indentNodeProp.add(type => {
    if (type.name == "IfStatement")
        return continuedIndent({ except: /^\s*({|else\b)/ });
    if (type.name == "TryStatement")
        return continuedIndent({ except: /^\s*({|catch|finally)\b/ });
    if (type.name == "LabeledStatement")
        return flatIndent;
    if (type.name == "SwitchBody")
        return context => {
            let after = context.textAfter, closed = /^\s*\}/.test(after), isCase = /^\s*(case|default)\b/.test(after);
            return context.baseIndent + (closed ? 0 : isCase ? 1 : 2) * context.unit;
        };
    if (type.name == "TemplateString" || type.name == "BlockComment")
        return () => -1;
    if (/(Statement|Declaration)$/.test(type.name) || type.name == "Property")
        return statementIndent;
    return undefined;
}), foldNodeProp.add({
    Block(tree) { return { from: tree.start + 1, to: tree.end - 1 }; },
    ObjectExpression(tree) { return { from: tree.start + 1, to: tree.end - 1 }; },
    ArrayExpression(tree) { return { from: tree.start + 1, to: tree.end - 1 }; },
    BlockComment(tree) { return { from: tree.start + 2, to: tree.end - 2 }; }
}), styleTags({
    "get set async static": "modifier",
    "for while do if else switch try catch finally return throw break continue default case": "keyword control",
    "in of await yield void typeof delete instanceof": "operatorKeyword",
    "export import let var const function class extends": "keyword definition",
    "with debugger from as": "keyword",
    TemplateString: "string#2",
    "BooleanLiteral Super": "atom",
    this: "self",
    null: "null",
    Star: "modifier",
    VariableName: "variableName",
    VariableDefinition: "variableName definition",
    Label: "labelName",
    PropertyName: "propertyName",
    PropertyNameDefinition: "propertyName definition",
    "PostfixOp UpdateOp": "updateOperator",
    LineComment: "lineComment",
    BlockComment: "blockComment",
    Number: "number",
    String: "string",
    ArithOp: "arithmeticOperator",
    LogicOp: "logicOperator",
    BitOp: "bitwiseOperator",
    CompareOp: "compareOperator",
    RegExp: "regexp",
    Equals: "operator definition",
    Spread: "punctuation",
    "Arrow :": "punctuation definition",
    "( )": "paren",
    "[ ]": "squareBracket",
    "{ }": "brace",
    ".": "derefOperator",
    ", ;": "separator"
})));
/// Returns an extension that installs the JavaScript syntax provider.
function javascript() { return javascriptSyntax.extension; }

const panelConfig = Facet.define({
    combine(configs) {
        let topContainer, bottomContainer;
        for (let c of configs) {
            topContainer = topContainer || c.topContainer;
            bottomContainer = bottomContainer || c.bottomContainer;
        }
        return { topContainer, bottomContainer };
    }
});
/// Enables the panel-managing extension.
function panels(config) {
    let ext = [panelPlugin, baseTheme$1];
    if (config)
        ext.push(panelConfig.of(config));
    return ext;
}
/// Opening a panel is done by providing an object describing the
/// panel through this facet.
const showPanel = Facet.define();
/// Get the active panel created by the given constructor, if any.
/// This can be useful when you need access to your panels' DOM
/// structure.
function getPanel(view, panel) {
    let plugin = view.plugin(panelPlugin);
    let index = view.state.facet(showPanel).indexOf(panel);
    return plugin && index > -1 ? plugin.panels[index] : null;
}
const panelPlugin = ViewPlugin.fromClass(class {
    constructor(view) {
        this.specs = view.state.facet(showPanel);
        this.panels = this.specs.map(spec => spec(view));
        let conf = view.state.facet(panelConfig);
        this.top = new PanelGroup(view, true, conf.topContainer);
        this.bottom = new PanelGroup(view, false, conf.bottomContainer);
        this.top.sync(this.panels.filter(p => p.top));
        this.bottom.sync(this.panels.filter(p => !p.top));
        for (let p of this.panels) {
            p.dom.className += " " + panelClass(p);
            if (p.mount)
                p.mount();
        }
    }
    update(update) {
        let conf = update.state.facet(panelConfig);
        if (this.top.container != conf.topContainer) {
            this.top.sync([]);
            this.top = new PanelGroup(update.view, true, conf.topContainer);
        }
        if (this.bottom.container != conf.bottomContainer) {
            this.bottom.sync([]);
            this.bottom = new PanelGroup(update.view, false, conf.bottomContainer);
        }
        this.top.syncClasses();
        this.bottom.syncClasses();
        let specs = update.state.facet(showPanel);
        if (specs != this.specs) {
            let panels = [], top = [], bottom = [], mount = [];
            for (let spec of specs) {
                let known = this.specs.indexOf(spec), panel;
                if (known < 0) {
                    panel = spec(update.view);
                    mount.push(panel);
                }
                else {
                    panel = this.panels[known];
                    if (panel.update)
                        panel.update(update);
                }
                panels.push(panel);
                (panel.top ? top : bottom).push(panel);
            }
            this.specs = specs;
            this.panels = panels;
            this.top.sync(top);
            this.bottom.sync(bottom);
            for (let p of mount) {
                p.dom.className += " " + panelClass(p);
                if (p.mount)
                    p.mount();
            }
        }
        else {
            for (let p of this.panels)
                if (p.update)
                    p.update(update);
        }
    }
    destroy() {
        this.top.sync([]);
        this.bottom.sync([]);
    }
}).provide(PluginField.scrollMargins, value => ({ top: value.top.scrollMargin(), bottom: value.bottom.scrollMargin() }));
function panelClass(panel) {
    return themeClass(panel.style ? `panel.${panel.style}` : "panel");
}
class PanelGroup {
    constructor(view, top, container) {
        this.view = view;
        this.top = top;
        this.container = container;
        this.dom = undefined;
        this.classes = "";
        this.panels = [];
        this.syncClasses();
    }
    sync(panels) {
        this.panels = panels;
        this.syncDOM();
    }
    syncDOM() {
        if (this.panels.length == 0) {
            if (this.dom) {
                this.dom.remove();
                this.dom = undefined;
            }
            return;
        }
        if (!this.dom) {
            this.dom = document.createElement("div");
            this.dom.className = themeClass(this.top ? "panels.top" : "panels.bottom");
            this.dom.style[this.top ? "top" : "bottom"] = "0";
            let parent = this.container || this.view.dom;
            parent.insertBefore(this.dom, this.top ? parent.firstChild : null);
        }
        let curDOM = this.dom.firstChild;
        for (let panel of this.panels) {
            if (panel.dom.parentNode == this.dom) {
                while (curDOM != panel.dom)
                    curDOM = rm$1(curDOM);
                curDOM = curDOM.nextSibling;
            }
            else {
                this.dom.insertBefore(panel.dom, curDOM);
            }
        }
        while (curDOM)
            curDOM = rm$1(curDOM);
    }
    scrollMargin() {
        return !this.dom || this.container ? 0
            : Math.max(0, this.top ? this.dom.getBoundingClientRect().bottom - this.view.scrollDOM.getBoundingClientRect().top
                : this.view.scrollDOM.getBoundingClientRect().bottom - this.dom.getBoundingClientRect().top);
    }
    syncClasses() {
        if (!this.container || this.classes == this.view.themeClasses)
            return;
        for (let cls of this.classes.split(" "))
            if (cls)
                this.container.classList.remove(cls);
        for (let cls of (this.classes = this.view.themeClasses).split(" "))
            if (cls)
                this.container.classList.add(cls);
    }
}
function rm$1(node) {
    let next = node.nextSibling;
    node.remove();
    return next;
}
const baseTheme$1 = EditorView.baseTheme({
    panels: {
        boxSizing: "border-box",
        position: "sticky",
        left: 0,
        right: 0,
        "& input, & button": {
            verticalAlign: "middle",
            color: "inherit",
            backgroundColor: "inherit",
            fontSize: "70%"
        },
        "& button": {
            padding: ".2em 1em",
            borderRadius: "3px"
        },
        "& input": {
            border: "1px solid silver",
            padding: ".2em .5em"
        }
    },
    "panels@light": {
        backgroundColor: "#f5f5f5",
        color: "black",
        "& button": {
            backgroundImage: "linear-gradient(#eff1f5, #d9d9df)",
            border: "1px solid #888",
            "&:active": {
                backgroundImage: "linear-gradient(#b4b4b4, #d0d3d6)"
            }
        }
    },
    "panels.top@light": {
        borderBottom: "1px solid silver"
    },
    "panels.bottom@light": {
        borderTop: "1px solid silver"
    },
    "panels@dark": {
        backgroundColor: "#333338",
        color: "white",
        "& button": {
            backgroundImage: "linear-gradient(#555, #111)",
            border: "1px solid #888",
            "&:active": {
                backgroundImage: "linear-gradient(#111, #333)"
            }
        },
        "& input": {
            border: "1px solid #555"
        }
    }
});

var base = {
  8: "Backspace",
  9: "Tab",
  10: "Enter",
  12: "NumLock",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  44: "PrintScreen",
  45: "Insert",
  46: "Delete",
  59: ";",
  61: "=",
  91: "Meta",
  92: "Meta",
  106: "*",
  107: "+",
  108: ",",
  109: "-",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock",
  160: "Shift",
  161: "Shift",
  162: "Control",
  163: "Control",
  164: "Alt",
  165: "Alt",
  173: "-",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "\\",
  221: "]",
  222: "'",
  229: "q"
};

var shift = {
  48: ")",
  49: "!",
  50: "@",
  51: "#",
  52: "$",
  53: "%",
  54: "^",
  55: "&",
  56: "*",
  57: "(",
  59: ":",
  61: "+",
  173: "_",
  186: ":",
  187: "+",
  188: "<",
  189: "_",
  190: ">",
  191: "?",
  192: "~",
  219: "{",
  220: "|",
  221: "}",
  222: "\"",
  229: "Q"
};

var chrome$1 = typeof navigator != "undefined" && /Chrome\/(\d+)/.exec(navigator.userAgent);
var safari = typeof navigator != "undefined" && /Apple Computer/.test(navigator.vendor);
var gecko$1 = typeof navigator != "undefined" && /Gecko\/\d+/.test(navigator.userAgent);
var mac = typeof navigator != "undefined" && /Mac/.test(navigator.platform);
var ie$1 = typeof navigator != "undefined" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
var brokenModifierNames = chrome$1 && (mac || +chrome$1[1] < 57) || gecko$1 && mac;

// Fill in the digit keys
for (var i = 0; i < 10; i++) base[48 + i] = base[96 + i] = String(i);

// The function keys
for (var i = 1; i <= 24; i++) base[i + 111] = "F" + i;

// And the alphabetic keys
for (var i = 65; i <= 90; i++) {
  base[i] = String.fromCharCode(i + 32);
  shift[i] = String.fromCharCode(i);
}

// For each code that doesn't have a shift-equivalent, copy the base name
for (var code in base) if (!shift.hasOwnProperty(code)) shift[code] = base[code];

function keyName(event) {
  // Don't trust event.key in Chrome when there are modifiers until
  // they fix https://bugs.chromium.org/p/chromium/issues/detail?id=633838
  var ignoreKey = brokenModifierNames && (event.ctrlKey || event.altKey || event.metaKey) ||
    (safari || ie$1) && event.shiftKey && event.key && event.key.length == 1;
  var name = (!ignoreKey && event.key) ||
    (event.shiftKey ? shift : base)[event.keyCode] ||
    event.key || "Unidentified";
  // Edge sometimes produces wrong names (Issue #3)
  if (name == "Esc") name = "Escape";
  if (name == "Del") name = "Delete";
  // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8860571/
  if (name == "Left") name = "ArrowLeft";
  if (name == "Up") name = "ArrowUp";
  if (name == "Right") name = "ArrowRight";
  if (name == "Down") name = "ArrowDown";
  return name
}

const currentPlatform = typeof navigator == "undefined" ? "key"
    : /Mac/.test(navigator.platform) ? "mac"
        : /Win/.test(navigator.platform) ? "win"
            : /Linux|X11/.test(navigator.platform) ? "linux"
                : "key";
function modifiers(name, event, shift) {
    if (event.altKey)
        name = "Alt-" + name;
    if (event.ctrlKey)
        name = "Ctrl-" + name;
    if (event.metaKey)
        name = "Meta-" + name;
    if (shift !== false && event.shiftKey)
        name = "Shift-" + name;
    return name;
}
const keymaps = Facet.define();
const handleKeyEvents = EditorView.domEventHandlers({
    keydown(event, view) {
        return runHandlers(view.state.facet(keymaps), event, view, "editor");
    }
});
/// Run the key handlers registered for a given scope. Returns true if
/// any of them handled the event.
function runScopeHandlers(view, event, scope) {
    return runHandlers(view.state.facet(keymaps), event, view, scope);
}
function runHandlers(maps, event, view, scope) {
    let name = keyName(event), isChar = name.length == 1 && name != " ";
    let prefix = "";
    let fallthrough = !!prefix;
    let runFor = (binding) => {
        if (binding) {
            for (let cmd of binding.commands)
                if (cmd(view))
                    return true;
            if (binding.preventDefault)
                fallthrough = true;
        }
        return false;
    };
    for (let map of maps) {
        let scopeObj = map[scope], baseName;
        if (!scopeObj)
            continue;
        if (runFor(scopeObj[prefix + modifiers(name, event, !isChar)]))
            return true;
        if (isChar && (event.shiftKey || event.altKey || event.metaKey) &&
            (baseName = base[event.keyCode]) && baseName != name) {
            if (runFor(scopeObj[prefix + modifiers(baseName, event, true)]))
                return true;
        }
        else if (isChar && event.shiftKey) {
            if (runFor(scopeObj[prefix + modifiers(name, event, true)]))
                return true;
        }
    }
    return fallthrough;
}

const basicNormalize = String.prototype.normalize ? x => x.normalize("NFKD") : x => x;
/// A search cursor provides an iterator over text matches in a
/// document.
class SearchCursor {
    /// Create a text cursor. The query is the search string, `from` to
    /// `to` provides the region to search.
    ///
    /// When `normalize` is given, it will be called, on both the query
    /// string and the content it is matched against, before comparing.
    /// You can, for example, create a case-insensitive search by
    /// passing `s => s.toLowerCase()`.
    ///
    /// Text is always normalized with
    /// [`.normalize("NFKD")`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
    /// (when supported).
    constructor(text, query, from = 0, to = text.length, normalize) {
        /// The current match (only holds a meaningful value after
        /// [`next`](#search.SearchCursor.next) has been called and when
        /// `done` is false).
        this.value = { from: 0, to: 0 };
        /// Whether the end of the iterated region has been reached.
        this.done = false;
        this.matches = [];
        this.buffer = "";
        this.bufferPos = 0;
        this.iter = text.iterRange(from, to);
        this.bufferStart = from;
        this.normalize = normalize ? x => normalize(basicNormalize(x)) : basicNormalize;
        this.query = this.normalize(query);
    }
    peek() {
        if (this.bufferPos == this.buffer.length) {
            this.bufferStart += this.buffer.length;
            this.iter.next();
            if (this.iter.done)
                return -1;
            this.bufferPos = 0;
            this.buffer = this.iter.value;
        }
        return this.buffer.charCodeAt(this.bufferPos);
    }
    /// Look for the next match. Updates the iterator's
    /// [`value`](#search.SearchCursor.value) and
    /// [`done`](#search.SearchCursor.done) properties. Should be called
    /// at least once before using the cursor.
    next() {
        for (;;) {
            let next = this.peek();
            if (next < 0) {
                this.done = true;
                return this;
            }
            let str = String.fromCharCode(next), start = this.bufferStart + this.bufferPos;
            this.bufferPos++;
            for (;;) {
                let peek = this.peek();
                if (peek < 0xDC00 || peek >= 0xE000)
                    break;
                this.bufferPos++;
                str += String.fromCharCode(peek);
            }
            let norm = this.normalize(str);
            for (let i = 0, pos = start;; i++) {
                let code = norm.charCodeAt(i);
                let match = this.match(code, pos);
                if (match) {
                    this.value = match;
                    return this;
                }
                if (i == norm.length - 1)
                    break;
                if (pos == start && i < str.length && str.charCodeAt(i) == code)
                    pos++;
            }
        }
    }
    match(code, pos) {
        let match = null;
        for (let i = 0; i < this.matches.length; i += 2) {
            let index = this.matches[i], keep = false;
            if (this.query.charCodeAt(index) == code) {
                if (index == this.query.length - 1) {
                    match = { from: this.matches[i + 1], to: pos + 1 };
                }
                else {
                    this.matches[i]++;
                    keep = true;
                }
            }
            if (!keep) {
                this.matches.splice(i, 2);
                i -= 2;
            }
        }
        if (this.query.charCodeAt(0) == code) {
            if (this.query.length == 1)
                match = { from: pos, to: pos + 1 };
            else
                this.matches.push(1, pos);
        }
        return match;
    }
}

class Query {
    constructor(search, replace, caseInsensitive) {
        this.search = search;
        this.replace = replace;
        this.caseInsensitive = caseInsensitive;
    }
    eq(other) {
        return this.search == other.search && this.replace == other.replace && this.caseInsensitive == other.caseInsensitive;
    }
    cursor(doc, from = 0, to = doc.length) {
        return new SearchCursor(doc, this.search, from, to, this.caseInsensitive ? x => x.toLowerCase() : undefined);
    }
    get valid() { return !!this.search; }
}
const setQuery = StateEffect.define();
const togglePanel = StateEffect.define();
const searchState = StateField.define({
    create() {
        return new SearchState(new Query("", "", false), []);
    },
    update(value, tr) {
        for (let effect of tr.effects) {
            if (effect.is(setQuery))
                value = new SearchState(effect.value, value.panel);
            else if (effect.is(togglePanel))
                value = new SearchState(value.query, effect.value ? [createSearchPanel] : []);
        }
        return value;
    },
    provide: [showPanel.nFrom(s => s.panel)]
});
class SearchState {
    constructor(query, panel) {
        this.query = query;
        this.panel = panel;
    }
}
const matchMark = Decoration.mark({ class: themeClass("searchMatch") }), selectedMatchMark = Decoration.mark({ class: themeClass("searchMatch.selected") });
const searchHighlighter = ViewPlugin.fromClass(class {
    constructor(view) {
        this.view = view;
        this.decorations = this.highlight(view.state.field(searchState));
    }
    update(update) {
        let state = update.state.field(searchState);
        if (state != update.prevState.field(searchState) || update.docChanged || update.selectionSet)
            this.decorations = this.highlight(state);
    }
    highlight({ query, panel }) {
        if (!panel.length || !query.valid)
            return Decoration.none;
        let state = this.view.state, viewport = this.view.viewport;
        let cursor = query.cursor(state.doc, Math.max(0, viewport.from - query.search.length), Math.min(viewport.to + query.search.length, state.doc.length));
        let builder = new RangeSetBuilder();
        while (!cursor.next().done) {
            let { from, to } = cursor.value;
            let selected = state.selection.ranges.some(r => r.from == from && r.to == to);
            builder.add(from, to, selected ? selectedMatchMark : matchMark);
        }
        return builder.finish();
    }
}).decorations();
function searchCommand(f) {
    return view => {
        let state = view.state.field(searchState, false);
        return state && state.query.valid ? f(view, state) : openSearchPanel(view);
    };
}
function findNextMatch(doc, from, query) {
    let cursor = query.cursor(doc, from).next();
    if (cursor.done) {
        cursor = query.cursor(doc, 0, from + query.search.length - 1).next();
        if (cursor.done)
            return null;
    }
    return cursor.value;
}
/// Open the search panel if it isn't already open, and move the
/// selection to the first match after the current primary selection.
/// Will wrap around to the start of the document when it reaches the
/// end.
const findNext = searchCommand((view, state) => {
    let { from, to } = view.state.selection.primary;
    let next = findNextMatch(view.state.doc, view.state.selection.primary.from + 1, state.query);
    if (!next || next.from == from && next.to == to)
        return false;
    view.dispatch(view.state.update({ selection: { anchor: next.from, head: next.to }, scrollIntoView: true }));
    maybeAnnounceMatch(view);
    return true;
});
const FindPrevChunkSize = 10000;
// Searching in reverse is, rather than implementing inverted search
// cursor, done by scanning chunk after chunk forward.
function findPrevInRange(query, doc, from, to) {
    for (let pos = to;;) {
        let start = Math.max(from, pos - FindPrevChunkSize - query.search.length);
        let cursor = query.cursor(doc, start, pos), range = null;
        while (!cursor.next().done)
            range = cursor.value;
        if (range)
            return range;
        if (start == from)
            return null;
        pos -= FindPrevChunkSize;
    }
}
/// Move the selection to the previous instance of the search query,
/// before the current primary selection. Will wrap past the start
/// of the document to start searching at the end again.
const findPrevious = searchCommand((view, { query }) => {
    let { state } = view;
    let range = findPrevInRange(query, state.doc, 0, state.selection.primary.to - 1) ||
        findPrevInRange(query, state.doc, state.selection.primary.from + 1, state.doc.length);
    if (!range)
        return false;
    view.dispatch(state.update({ selection: { anchor: range.from, head: range.to }, scrollIntoView: true }));
    maybeAnnounceMatch(view);
    return true;
});
/// Select all instances of the search query.
const selectMatches = searchCommand((view, { query }) => {
    let cursor = query.cursor(view.state.doc), ranges = [];
    while (!cursor.next().done)
        ranges.push(EditorSelection.range(cursor.value.from, cursor.value.to));
    if (!ranges.length)
        return false;
    view.dispatch(view.state.update({ selection: EditorSelection.create(ranges) }));
    return true;
});
/// Replace the current match of the search query.
const replaceNext = searchCommand((view, { query }) => {
    let { state } = view, next = findNextMatch(state.doc, state.selection.primary.from, query);
    if (!next)
        return false;
    let { from, to } = state.selection.primary, changes = [], selection;
    if (next.from == from && next.to == to) {
        changes.push({ from: next.from, to: next.to, insert: query.replace });
        next = findNextMatch(state.doc, next.to, query);
    }
    if (next) {
        let off = changes.length == 0 || changes[0].from >= next.to ? 0 : next.to - next.from - query.replace.length;
        selection = { anchor: next.from - off, head: next.to - off };
    }
    view.dispatch(state.update({ changes, selection, scrollIntoView: !!selection }));
    if (next)
        maybeAnnounceMatch(view);
    return true;
});
/// Replace all instances of the search query with the given
/// replacement.
const replaceAll = searchCommand((view, { query }) => {
    let cursor = query.cursor(view.state.doc), changes = [];
    while (!cursor.next().done) {
        let { from, to } = cursor.value;
        changes.push({ from, to, insert: query.replace });
    }
    if (!changes.length)
        return false;
    view.dispatch(view.state.update({ changes }));
    return true;
});
function createSearchPanel(view) {
    let { query } = view.state.field(searchState);
    return {
        dom: buildPanel({
            view,
            query,
            updateQuery(q) {
                if (!query.eq(q)) {
                    query = q;
                    view.dispatch(view.state.update({ effects: setQuery.of(query) }));
                }
            }
        }),
        mount() {
            this.dom.querySelector("[name=search]").select();
        },
        pos: 80,
        style: "search"
    };
}
const tag = typeof Symbol == "function" ? Symbol("search") : "__search-tag";
/// Make sure the search panel is open and focused.
const openSearchPanel = view => {
    let state = view.state.field(searchState, false);
    if (state && state.panel.length)
        return false;
    view.dispatch(view.state.update({ effects: togglePanel.of(true),
        replaceExtensions: state ? undefined : { [tag]: searchExtensions } }));
    return true;
};
/// Close the search panel.
const closeSearchPanel = view => {
    let state = view.state.field(searchState, false);
    if (!state || !state.panel.length)
        return false;
    let panel = getPanel(view, createSearchPanel);
    if (panel && panel.dom.contains(view.root.activeElement))
        view.focus();
    view.dispatch(view.state.update({ effects: togglePanel.of(false) }));
    return true;
};
function elt(name, props = null, children = []) {
    let e = document.createElement(name);
    if (props)
        for (let prop in props) {
            let value = props[prop];
            if (typeof value == "string")
                e.setAttribute(prop, value);
            else
                e[prop] = value;
        }
    for (let child of children)
        e.appendChild(typeof child == "string" ? document.createTextNode(child) : child);
    return e;
}
// FIXME sync when search state changes independently
function buildPanel(conf) {
    function p(phrase) { return conf.view.state.phrase(phrase); }
    let searchField = elt("input", {
        value: conf.query.search,
        placeholder: p("Find"),
        "aria-label": p("Find"),
        name: "search",
        onchange: update,
        onkeyup: update
    });
    let replaceField = elt("input", {
        value: conf.query.replace,
        placeholder: p("Replace"),
        "aria-label": p("Replace"),
        name: "replace",
        onchange: update,
        onkeyup: update
    });
    let caseField = elt("input", {
        type: "checkbox",
        name: "case",
        checked: !conf.query.caseInsensitive,
        onchange: update
    });
    function update() {
        conf.updateQuery(new Query(searchField.value, replaceField.value, !caseField.checked));
    }
    function keydown(e) {
        if (runScopeHandlers(conf.view, e, "search-panel")) {
            e.preventDefault();
        }
        else if (e.keyCode == 27) {
            e.preventDefault();
            closeSearchPanel(conf.view);
        }
        else if (e.keyCode == 13 && e.target == searchField) {
            e.preventDefault();
            (e.shiftKey ? findPrevious : findNext)(conf.view);
        }
        else if (e.keyCode == 13 && e.target == replaceField) {
            e.preventDefault();
            replaceNext(conf.view);
        }
    }
    let panel = elt("div", { onkeydown: keydown }, [
        searchField,
        elt("button", { name: "next", onclick: () => findNext(conf.view) }, [p("next")]),
        elt("button", { name: "prev", onclick: () => findPrevious(conf.view) }, [p("previous")]),
        elt("button", { name: "select", onclick: () => selectMatches(conf.view) }, [p("all")]),
        elt("label", null, [caseField, "match case"]),
        elt("br"),
        replaceField,
        elt("button", { name: "replace", onclick: () => replaceNext(conf.view) }, [p("replace")]),
        elt("button", { name: "replaceAll", onclick: () => replaceAll(conf.view) }, [p("replace all")]),
        elt("button", { name: "close", onclick: () => closeSearchPanel(conf.view), "aria-label": p("close") }, ["×"]),
        elt("div", { style: "position: absolute; top: -10000px", "aria-live": "polite" })
    ]);
    return panel;
}
const AnnounceMargin = 30;
const Break = /[\s\.,:;?!]/;
// FIXME this is a kludge
function maybeAnnounceMatch(view) {
    let { from, to } = view.state.selection.primary;
    let lineStart = view.state.doc.lineAt(from).start, lineEnd = view.state.doc.lineAt(to).end;
    let start = Math.max(lineStart, from - AnnounceMargin), end = Math.min(lineEnd, to + AnnounceMargin);
    let text = view.state.sliceDoc(start, end);
    if (start != lineStart) {
        for (let i = 0; i < AnnounceMargin; i++)
            if (!Break.test(text[i + 1]) && Break.test(text[i])) {
                text = text.slice(i);
                break;
            }
    }
    if (end != lineEnd) {
        for (let i = text.length - 1; i > text.length - AnnounceMargin; i--)
            if (!Break.test(text[i - 1]) && Break.test(text[i])) {
                text = text.slice(0, i);
                break;
            }
    }
    let panel = getPanel(view, createSearchPanel);
    if (!panel || !panel.dom.contains(view.root.activeElement))
        return;
    let live = panel.dom.querySelector("div[aria-live]");
    live.textContent = view.state.phrase("current match") + ". " + text;
}
const baseTheme$2 = EditorView.baseTheme({
    "panel.search": {
        padding: "2px 6px 4px",
        position: "relative",
        "& [name=close]": {
            position: "absolute",
            top: "0",
            right: "4px",
            backgroundColor: "inherit",
            border: "none",
            font: "inherit",
            padding: 0,
            margin: 0
        },
        "& input, & button": {
            margin: ".2em .5em .2em 0"
        },
        "& label": {
            fontSize: "80%"
        }
    },
    "searchMatch@light": { backgroundColor: "#ffa" },
    "searchMatch@dark": { backgroundColor: "#088" },
    "searchMatch.selected@light": { backgroundColor: "#fca" },
    "searchMatch.selected@dark": { backgroundColor: "#808" }
});
const searchExtensions = [
    searchState,
    searchHighlighter,
    panels(),
    baseTheme$2
];

/// Mark lines that have a cursor on them with the \`activeLine\`
/// theme selector.
function highlightActiveLine() {
    return [defaultTheme, activeLineHighlighter];
}
const lineDeco = Decoration.line({ attributes: { class: themeClass("activeLine") } });
const activeLineHighlighter = ViewPlugin.fromClass(class {
    constructor(view) {
        this.decorations = this.getDeco(view);
    }
    update(update) {
        if (update.docChanged || update.selectionSet)
            this.decorations = this.getDeco(update.view);
    }
    getDeco(view) {
        let lastLineStart = -1, deco = [];
        for (let r of view.state.selection.ranges) {
            if (!r.empty)
                continue;
            let line = view.lineAt(r.head, 0);
            if (line.from > lastLineStart) {
                deco.push(lineDeco.range(line.from));
                lastLineStart = line.from;
            }
        }
        return Decoration.set(deco);
    }
}).decorations();
const defaultHighlightOptions = {
    highlightWordAroundCursor: false,
    minSelectionLength: 1,
    maxMatches: 100
};
const highlightConfig = Facet.define({
    combine(options) {
        return combineConfig(options, defaultHighlightOptions, {
            highlightWordAroundCursor: (a, b) => a || b,
            minSelectionLength: Math.min,
            maxMatches: Math.min
        });
    }
});
function wordAt(doc, pos, check) {
    let line = doc.lineAt(pos);
    let from = pos - line.start, to = pos - line.start;
    while (from > 0) {
        let prev = line.findClusterBreak(from, false);
        if (check(line.slice(prev, from)) != CharCategory.Word)
            break;
        from = prev;
    }
    while (to < line.length) {
        let next = line.findClusterBreak(to, true);
        if (check(line.slice(to, next)) != CharCategory.Word)
            break;
        to = next;
    }
    return from == to ? null : line.slice(from, to);
}
const matchDeco = Decoration.mark({ class: themeClass("selectionMatch") });
const mainMatchDeco = Decoration.mark({ class: themeClass("selectionMatch.main") });
const matchHighlighter = ViewPlugin.fromClass(class {
    constructor(view) {
        this.decorations = this.getDeco(view);
    }
    update(update) {
        if (update.selectionSet || update.docChanged)
            this.decorations = this.getDeco(update.view);
    }
    getDeco(view) {
        let conf = view.state.facet(highlightConfig);
        let { state } = view, sel = state.selection;
        if (sel.ranges.length > 1)
            return Decoration.none;
        let range = sel.primary, query, check = null;
        if (range.empty) {
            if (!conf.highlightWordAroundCursor)
                return Decoration.none;
            check = state.charCategorizer(range.head);
            query = wordAt(state.doc, range.head, check);
            if (!query)
                return Decoration.none;
        }
        else {
            let len = range.to - range.from;
            if (len < conf.minSelectionLength || len > 200)
                return Decoration.none;
            query = state.sliceDoc(range.from, range.to).trim();
            if (!query)
                return Decoration.none;
        }
        let deco = [];
        for (let part of view.visibleRanges) {
            let cursor = new SearchCursor(state.doc, query, part.from, part.to);
            while (!cursor.next().done) {
                let { from, to } = cursor.value;
                if (!check || ((from == 0 || check(state.sliceDoc(from - 1, from)) != CharCategory.Word) &&
                    (to == state.doc.length || check(state.sliceDoc(to, to + 1)) != CharCategory.Word))) {
                    if (check && from <= range.from && to >= range.to)
                        deco.push(mainMatchDeco.range(from, to));
                    else if (from >= range.to || to <= range.from)
                        deco.push(matchDeco.range(from, to));
                    if (deco.length > conf.maxMatches)
                        return Decoration.none;
                }
            }
        }
        return Decoration.set(deco);
    }
}).decorations();
const defaultTheme = EditorView.baseTheme({
    "activeLine@light": { backgroundColor: "#e8f2ff" },
    "activeLine@dark": { backgroundColor: "#223039" },
    "selectionMatch": { backgroundColor: "#cfb" }
});

const baseTheme$3 = EditorView.baseTheme({
    matchingBracket: { color: "#0b0" },
    nonmatchingBracket: { color: "#a22" }
});
const DefaultScanDist = 10000, DefaultBrackets = "()[]{}";
const bracketMatchingConfig = Facet.define({
    combine(configs) {
        return combineConfig(configs, {
            afterCursor: true,
            brackets: DefaultBrackets,
            maxScanDistance: DefaultScanDist
        });
    }
});
const matchingMark = Decoration.mark({ class: themeClass("matchingBracket") }), nonmatchingMark = Decoration.mark({ class: themeClass("nonmatchingBracket") });
const bracketMatchingState = StateField.define({
    create() { return Decoration.none; },
    update(deco, tr, state) {
        if (!tr.docChanged && !tr.selection)
            return deco;
        let decorations = [];
        let config = state.facet(bracketMatchingConfig);
        for (let range of state.selection.ranges) {
            if (!range.empty)
                continue;
            let match = matchBrackets(state, range.head, -1, config)
                || (range.head > 0 && matchBrackets(state, range.head - 1, 1, config))
                || (config.afterCursor &&
                    (matchBrackets(state, range.head, 1, config) ||
                        (range.head < state.doc.length && matchBrackets(state, range.head + 1, -1, config))));
            if (!match)
                continue;
            let mark = match.matched ? matchingMark : nonmatchingMark;
            decorations.push(mark.range(match.start.from, match.start.to));
            if (match.end)
                decorations.push(mark.range(match.end.from, match.end.to));
        }
        return Decoration.set(decorations, true);
    },
    provide: [EditorView.decorations]
});
const bracketMatchingUnique = [
    bracketMatchingState,
    baseTheme$3
];
/// Create an extension that enables bracket matching. Whenever the
/// cursor is next to a bracket, that bracket and the one it matches
/// are highlighted. Or, when no matching bracket is found, another
/// highlighting style is used to indicate this.
function bracketMatching(config = {}) {
    return [bracketMatchingConfig.of(config), bracketMatchingUnique];
}
function matchingNodes(node, dir, brackets) {
    let byProp = node.prop(dir < 0 ? NodeProp.openedBy : NodeProp.closedBy);
    if (byProp)
        return byProp;
    if (node.name.length == 1) {
        let index = brackets.indexOf(node.name);
        if (index > -1 && index % 2 == (dir < 0 ? 1 : 0))
            return [brackets[index + dir]];
    }
    return null;
}
/// Find the matching bracket for the token at `pos`, scanning
/// direction `dir`. Only the `brackets` and `maxScanDistance`
/// properties are used from `config`, if given. Returns null if no
/// bracket was found at `pos`, or a match result otherwise.
function matchBrackets(state, pos, dir, config = {}) {
    let maxScanDistance = config.maxScanDistance || DefaultScanDist, brackets = config.brackets || DefaultBrackets;
    let tree = state.tree, sub = tree.resolve(pos, dir), matches;
    if (matches = matchingNodes(sub.type, dir, brackets))
        return matchMarkedBrackets(state, pos, dir, sub, matches, brackets);
    else
        return matchPlainBrackets(state, pos, dir, tree, sub.type, maxScanDistance, brackets);
}
function matchMarkedBrackets(_state, _pos, dir, token, matching, brackets) {
    let parent = token.parent, firstToken = { from: token.start, to: token.end };
    let depth = 0;
    return (parent && parent.iterate({
        from: dir < 0 ? token.start : token.end,
        to: dir < 0 ? parent.start : parent.end,
        enter(type, from, to) {
            if (dir < 0 ? to > token.start : from < token.end)
                return undefined;
            if (depth == 0 && matching.indexOf(type.name) > -1) {
                return { start: firstToken, end: { from, to }, matched: true };
            }
            else if (matchingNodes(type, dir, brackets)) {
                depth++;
            }
            else if (matchingNodes(type, -dir, brackets)) {
                depth--;
                if (depth == 0)
                    return { start: firstToken, end: { from, to }, matched: false };
            }
            return false;
        }
    })) || { start: firstToken, matched: false };
}
function matchPlainBrackets(state, pos, dir, tree, tokenType, maxScanDistance, brackets) {
    let startCh = dir < 0 ? state.sliceDoc(pos - 1, pos) : state.sliceDoc(pos, pos + 1);
    let bracket = brackets.indexOf(startCh);
    if (bracket < 0 || (bracket % 2 == 0) != (dir > 0))
        return null;
    let startToken = { from: dir < 0 ? pos - 1 : pos, to: dir > 0 ? pos + 1 : pos };
    let iter = state.doc.iterRange(pos, dir > 0 ? state.doc.length : 0), depth = 0;
    for (let distance = 0; !(iter.next()).done && distance <= maxScanDistance;) {
        let text = iter.value;
        if (dir < 0)
            distance += text.length;
        let basePos = pos + distance * dir;
        for (let pos = dir > 0 ? 0 : text.length - 1, end = dir > 0 ? text.length : -1; pos != end; pos += dir) {
            let found = brackets.indexOf(text[pos]);
            if (found < 0 || tree.resolve(basePos + pos, 1).type != tokenType)
                continue;
            if ((found % 2 == 0) == (dir > 0)) {
                depth++;
            }
            else if (depth == 1) { // Closing
                return { start: startToken, end: { from: basePos + pos, to: basePos + pos + 1 }, matched: (found >> 1) == (bracket >> 1) };
            }
            else {
                depth--;
            }
        }
        if (dir > 0)
            distance += text.length;
    }
    return iter.done ? { start: startToken, matched: false } : null;
}

/// A gutter marker represents a bit of information attached to a line
/// in a specific gutter. Your own custom markers have to extend this
/// class.
class GutterMarker extends RangeValue {
    /// @internal
    compare(other) {
        return this == other || this.constructor == other.constructor && this.eq(other);
    }
    /// Render the DOM node for this marker, if any.
    toDOM(_view) { return null; }
    /// Create a range that places this marker at the given position.
    at(pos) { return new Range(pos, pos, this); }
}
GutterMarker.prototype.elementClass = "";
GutterMarker.prototype.mapMode = MapMode.TrackBefore;
const defaults = {
    style: "",
    renderEmptyElements: false,
    elementStyle: "",
    markers: () => RangeSet.empty,
    lineMarker: () => null,
    initialSpacer: null,
    updateSpacer: null,
    domEventHandlers: {}
};
const activeGutters = Facet.define();
/// Define an editor gutter.
function gutter(config) {
    return [gutters(), activeGutters.of(fillConfig(config, defaults))];
}
const baseTheme$4 = EditorView.baseTheme({
    gutters: {
        display: "flex",
        height: "100%",
        boxSizing: "border-box",
        left: 0
    },
    "gutters@light": {
        backgroundColor: "#f5f5f5",
        color: "#999",
        borderRight: "1px solid silver"
    },
    "gutters@dark": {
        backgroundColor: "#333338",
        color: "#ccc"
    },
    gutter: {
        display: "flex !important",
        flexDirection: "column",
        flexShrink: 0,
        boxSizing: "border-box",
        height: "100%",
        overflow: "hidden"
    },
    gutterElement: {
        boxSizing: "border-box"
    },
    "gutterElement.lineNumber": {
        padding: "0 3px 0 5px",
        minWidth: "20px",
        textAlign: "right",
        whiteSpace: "nowrap"
    }
});
const unfixGutters = Facet.define({
    combine: values => values.some(x => x)
});
/// The gutter-drawing plugin is automatically enabled when you add a
/// gutter, but you can use this function to explicitly configure it.
///
/// Unless `fixed` is explicitly set to `false`, the gutters are
/// fixed, meaning they don't scroll along with the content
/// horizontally.
function gutters(config) {
    let result = [
        gutterView,
        baseTheme$4
    ];
    if (config && config.fixed === false)
        result.push(unfixGutters.of(true));
    return result;
}
const gutterView = ViewPlugin.fromClass(class {
    constructor(view) {
        this.view = view;
        this.dom = document.createElement("div");
        this.dom.className = themeClass("gutters");
        this.dom.setAttribute("aria-hidden", "true");
        this.gutters = view.state.facet(activeGutters).map(conf => new SingleGutterView(view, conf));
        for (let gutter of this.gutters)
            this.dom.appendChild(gutter.dom);
        this.fixed = !view.state.facet(unfixGutters);
        if (this.fixed) {
            // FIXME IE11 fallback, which doesn't support position: sticky,
            // by using position: relative + event handlers that realign the
            // gutter (or just force fixed=false on IE11?)
            this.dom.style.position = "sticky";
        }
        view.scrollDOM.insertBefore(this.dom, view.contentDOM);
    }
    update(update) {
        if (!this.updateGutters(update))
            return;
        let contexts = this.gutters.map(gutter => new UpdateContext(gutter, this.view.viewport));
        this.view.viewportLines(line => {
            let text;
            if (Array.isArray(line.type))
                text = line.type.find(b => b.type == BlockType.Text);
            else
                text = line.type == BlockType.Text ? line : undefined;
            if (!text)
                return;
            for (let cx of contexts)
                cx.line(this.view, text);
        }, 0);
        for (let cx of contexts)
            cx.finish();
        this.dom.style.minHeight = this.view.contentHeight + "px";
        if (update.state.facet(unfixGutters) != !this.fixed) {
            this.fixed = !this.fixed;
            this.dom.style.position = this.fixed ? "sticky" : "";
        }
    }
    updateGutters(update) {
        let prev = update.prevState.facet(activeGutters), cur = update.state.facet(activeGutters);
        let change = update.docChanged || update.heightChanged;
        if (prev == cur) {
            for (let gutter of this.gutters)
                if (gutter.update(update))
                    change = true;
        }
        else {
            change = true;
            let gutters = [];
            for (let conf of cur) {
                let known = prev.indexOf(conf);
                if (known < 0) {
                    gutters.push(new SingleGutterView(this.view, conf));
                }
                else {
                    this.gutters[known].update(update);
                    gutters.push(this.gutters[known]);
                }
            }
            for (let g of this.gutters)
                g.dom.remove();
            for (let g of gutters)
                this.dom.appendChild(g.dom);
            this.gutters = gutters;
        }
        return change;
    }
}).provide(PluginField.scrollMargins, value => {
    if (value.gutters.length == 0 || !value.fixed)
        return null;
    return value.view.textDirection == Direction.LTR ? { left: value.dom.offsetWidth } : { right: value.dom.offsetWidth };
});
class UpdateContext {
    constructor(gutter, viewport) {
        this.gutter = gutter;
        this.localMarkers = [];
        this.i = 0;
        this.height = 0;
        this.cursor = RangeSet.iter(Array.isArray(gutter.markers) ? gutter.markers : [gutter.markers], viewport.from);
    }
    line(view, line) {
        if (this.localMarkers.length)
            this.localMarkers = [];
        while (this.cursor.value && this.cursor.from <= line.from) {
            if (this.cursor.from == line.from)
                this.localMarkers.push(this.cursor.value);
            this.cursor.next();
        }
        let forLine = this.gutter.config.lineMarker(view, line, this.localMarkers);
        if (forLine)
            this.localMarkers.unshift(forLine);
        let gutter = this.gutter;
        if (this.localMarkers.length == 0 && !gutter.config.renderEmptyElements)
            return;
        let above = line.top - this.height;
        if (this.i == gutter.elements.length) {
            let newElt = new GutterElement(view, line.height, above, this.localMarkers, gutter.elementClass);
            gutter.elements.push(newElt);
            gutter.dom.appendChild(newElt.dom);
        }
        else {
            let markers = this.localMarkers, elt = gutter.elements[this.i];
            if (sameMarkers(markers, elt.markers)) {
                markers = elt.markers;
                this.localMarkers.length = 0;
            }
            elt.update(view, line.height, above, markers, gutter.elementClass);
        }
        this.height = line.bottom;
        this.i++;
    }
    finish() {
        let gutter = this.gutter;
        while (gutter.elements.length > this.i)
            gutter.dom.removeChild(gutter.elements.pop().dom);
    }
}
class SingleGutterView {
    constructor(view, config) {
        this.view = view;
        this.config = config;
        this.elements = [];
        this.spacer = null;
        this.dom = document.createElement("div");
        this.dom.className = themeClass("gutter" + (this.config.style ? "." + this.config.style : ""));
        this.elementClass = themeClass("gutterElement" + (this.config.style ? "." + this.config.style : ""));
        for (let prop in config.domEventHandlers) {
            this.dom.addEventListener(prop, (event) => {
                let line = view.lineAtHeight(event.clientY);
                if (config.domEventHandlers[prop](view, line, event))
                    event.preventDefault();
            });
        }
        this.markers = config.markers(view.state);
        if (config.initialSpacer) {
            this.spacer = new GutterElement(view, 0, 0, [config.initialSpacer(view)], this.elementClass);
            this.dom.appendChild(this.spacer.dom);
            this.spacer.dom.style.cssText += "visibility: hidden; pointer-events: none";
        }
    }
    update(update) {
        let prevMarkers = this.markers;
        this.markers = this.config.markers(update.state);
        if (this.spacer && this.config.updateSpacer) {
            let updated = this.config.updateSpacer(this.spacer.markers[0], update);
            if (updated != this.spacer.markers[0])
                this.spacer.update(update.view, 0, 0, [updated], this.elementClass);
        }
        return this.markers == prevMarkers;
    }
    destroy() {
        this.dom.remove();
    }
}
class GutterElement {
    constructor(view, height, above, markers, eltClass) {
        this.height = -1;
        this.above = 0;
        this.dom = document.createElement("div");
        this.update(view, height, above, markers, eltClass);
    }
    update(view, height, above, markers, cssClass) {
        if (this.height != height)
            this.dom.style.height = (this.height = height) + "px";
        if (this.above != above)
            this.dom.style.marginTop = (this.above = above) ? above + "px" : "";
        if (this.markers != markers) {
            this.markers = markers;
            for (let ch; ch = this.dom.lastChild;)
                ch.remove();
            let cls = cssClass;
            for (let m of markers) {
                let dom = m.toDOM(view);
                if (dom)
                    this.dom.appendChild(dom);
                let c = m.elementClass;
                if (c)
                    cls += " " + c;
            }
            this.dom.className = cls;
        }
    }
}
function sameMarkers(a, b) {
    if (a.length != b.length)
        return false;
    for (let i = 0; i < a.length; i++)
        if (!a[i].compare(b[i]))
            return false;
    return true;
}
/// Facet used to provide markers to the line number gutter.
const lineNumberMarkers = Facet.define();
const lineNumberConfig = Facet.define({
    combine(values) {
        return combineConfig(values, { formatNumber: String, domEventHandlers: {} }, {
            domEventHandlers(a, b) {
                let result = {};
                for (let event in a)
                    result[event] = a[event];
                for (let event in b) {
                    let exists = result[event], add = b[event];
                    result[event] = exists ? (view, line, event) => exists(view, line, event) || add(view, line, event) : add;
                }
                return result;
            }
        });
    }
});
class NumberMarker extends GutterMarker {
    constructor(number) {
        super();
        this.number = number;
    }
    eq(other) { return this.number == other.number; }
    toDOM(view) {
        let config = view.state.facet(lineNumberConfig);
        return document.createTextNode(config.formatNumber(this.number));
    }
}
const lineNumberGutter = gutter({
    style: "lineNumber",
    markers(state) { return state.facet(lineNumberMarkers); },
    lineMarker(view, line, others) {
        if (others.length)
            return null;
        // FIXME try to make the line number queries cheaper?
        return new NumberMarker(view.state.doc.lineAt(line.from).number);
    },
    initialSpacer(view) {
        return new NumberMarker(maxLineNumber(view.state.doc.lines));
    },
    updateSpacer(spacer, update) {
        let max = maxLineNumber(update.view.state.doc.lines);
        return max == spacer.number ? spacer : new NumberMarker(max);
    }
});
/// Create a line number gutter extension. The order in which the
/// gutters appear is determined by their extension priority.
function lineNumbers(config = {}) {
    return [
        lineNumberConfig.of(config),
        lineNumberGutter
    ];
}
function maxLineNumber(lines) {
    let last = 9;
    while (last < lines)
        last = last * 10 + 9;
    return last;
}

const chalky = "#e5c07b", coral = "#e06c75", dark = "#5c6370", fountainBlue = "#56b6c2", green = "#98c379", invalid = "#ffffff", lightDark = "#7f848e", lightWhite = "#abb2bf", malibu = "#61afef", purple = "#c678dd", whiskey = "#d19a66", background = "#282c34", selection = "#405948", cursor = "#528bff";
const oneDarkTheme = EditorView.theme({
    wrap: {
        color: lightWhite,
        backgroundColor: background,
        "& ::selection": { backgroundColor: selection },
        caretColor: cursor
    },
    secondaryCursor: { borderLeft: `1.4px solid ${cursor}` },
    secondarySelection: { backgroundColor: selection },
    panels: { backgroundColor: background, color: lightWhite },
    "panels.top": { borderBottom: "2px solid black" },
    "panels.bottom": { borderTop: "2px solid black" },
    searchMatch: {
        backgroundColor: "#42557b",
        border: "1px solid #457dff"
    },
    "searchMatch.selected": {
        backgroundColor: "#6199ff2f"
    },
    activeLine: { backgroundColor: "#2c313c" },
    selectionMatch: { backgroundColor: "#354139" },
    "matchingBracket, nonmatchingBracket": {
        backgroundColor: "#515a6b",
        border: "1px solid #515a6b"
    },
    gutters: {
        backgroundColor: background,
        color: "#495162",
        border: "none"
    },
    "gutterElement.lineNumber": { color: "inherit" },
    foldPlaceholder: {
        backgroundColor: "none",
        border: "none",
        color: "#ddd"
    },
    tooltip: {
        border: "1px solid #181a1f",
        backgroundColor: "#606862"
    },
    "tooltip.autocomplete": {
        "& > li[aria-selected]": { backgroundColor: background }
    }
}, { dark: true });
const oneDarkHighlighter = highlighter({
    invalid: { color: invalid },
    comment: { color: lightDark },
    keyword: { color: purple },
    "name, deleted": { color: coral },
    "operator, operatorKeyword, regexp": { color: fountainBlue },
    "string, inserted": { color: green },
    propertyName: { color: malibu },
    "color, name constant, name standard": { color: whiskey },
    "name definition": { color: lightWhite },
    "typeName, className, number, changed": { color: chalky },
    "meta": { color: dark },
    strong: { fontWeight: "bold" },
    emphasis: { fontStyle: "italic" },
    link: { color: dark, textDecoration: "underline" },
    heading: { fontWeight: "bold", color: coral }
});
/// Extension to enable the One Dark theme.
const oneDark = [oneDarkTheme, oneDarkHighlighter];

let EditorCode = class EditorCode extends MobxLitElement {
    constructor() {
        super(...arguments);
        this.sourceCode = null;
        this.editorState = EditorState.create({
            doc: 'Hello World',
            extensions: [
                lineNumbers(),
                javascript(),
                highlightActiveLine(),
                bracketMatching(),
                // EditorState.indentUnit.of(4),
                oneDark,
            ],
        });
        this.editorView = new EditorView({
            state: this.editorState,
        });
    }
    render() {
        return html `
            <textarea class=${modules_e6e9bf22.codemirrorElement}></textarea>
        `;
    }
    firstUpdated(_changedProperties) {
        const textArea = this.shadowRoot.querySelector(modules_e6e9bf22.codemirrorElement);
        if (!textArea) {
            throw new Error('Could not find textArea element!');
        }
        // this.codeMirrorEditor = CodeMirror.fromTextArea(textArea, {
        //     value: this.sourceCode || '',
        //     viewportMargin: Infinity,
        //     lineWrapping: true,
        //     indentUnit: 4,
        // });
    }
    updated(changedProperties) {
        // if (changedProperties.has('sourceCode')) {
        //     this.codeMirrorEditor?.setValue(this.sourceCode || '');
        // }
    }
};
EditorCode.styles = unsafeCSS(css$9);
__decorate([
    property()
], EditorCode.prototype, "sourceCode", void 0);
EditorCode = __decorate([
    customElement('my-editor-code')
], EditorCode);

const css$a = ".editor_c8c1fdf6 {\n  position: relative;\n  overflow: auto;\n  overflow-x: hidden;\n  height: 100%; }\n\n.editorCode_c8c1fdf6 {\n  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n  border-radius: 2px;\n  background: #232323;\n  position: relative;\n  height: auto;\n  width: 100%; }\n";
const modules_eb861c89 = {"editor":"editor_c8c1fdf6","editorCode":"editorCode_c8c1fdf6"};

let Editor = class Editor extends MobxLitElement {
    constructor() {
        super(...arguments);
        this.exampleService = globalDependencies.get('exampleService');
        this.sourceCode = null;
        // private async loadExample(): Promise<TemplateResult> {
        //
        //     if (this.examplePath === null) {
        //         throw new Error('No examplePath provided!')
        //     }
        //
        //     try {
        //         const response = await fetch(`public/js/${this.examplePath}?no-cache=${Date.now()}`, {
        //             cache: 'no-cache',
        //             method: 'GET',
        //             mode: 'cors',
        //         });
        //
        //         if (!response || !response.ok) {
        //             return null;
        //         }
        //
        //         return response.text();
        //     } catch (e) {
        //         return null;
        //     }
        // }
        //
        // private async refreshPreview(event: CustomEvent<IRefreshPreviewEvent>): Promise<void> {
        //
        //     const code = event.detail?.code ?? null;
        //
        //     if (this.code === code || code === null) {
        //         return;
        //     }
        //
        //     this.code = code;
        // }
    }
    connectedCallback() {
        super.connectedCallback();
        autorun(() => {
            console.log('reaction', this.exampleService.currentExample);
            this.loadSourceCode(this.exampleService.currentExample);
        });
    }
    async loadSourceCode(example) {
        if (example === null) {
            return;
        }
        this.sourceCode = await this.exampleService.loadExampleSource(example.path);
    }
    render() {
        var _a;
        const exampleName = ((_a = this.exampleService.currentExample) === null || _a === void 0 ? void 0 : _a.name) || '';
        return html `
            <div class=${modules_eb861c89.editor}>
                <my-editor-preview sourceCode=${this.sourceCode} />

                <section class=${modules_eb861c89.editorCode}>
                    <my-toolbar title="${`Example Code: ${exampleName}`}">
                        <my-button @click="${this.triggerRefreshPreview}">REFRESH</my-button>
                    </my-toolbar>
                    <my-editor-code sourceCode=${this.sourceCode} />
                </section>
            </div>
        `;
    }
    triggerRefreshPreview() {
        console.log('Refresh click!');
        //
        // if (this.codeMirrorEditor === null) {
        //     throw new Error('No Editor was found!');
        // }
    }
};
Editor.styles = unsafeCSS(css$a);
__decorate([
    internalProperty()
], Editor.prototype, "sourceCode", void 0);
Editor = __decorate([
    customElement('my-editor')
], Editor);

configure({ enforceActions: 'observed' });
globalDependencies
    .loadDependencies({
    requestOptions: {
        cache: 'no-cache',
        method: 'GET',
        mode: 'cors',
    }
})
    .then(() => render(html `<my-app />`, window.document.body))
    .catch((error) => console.error('An error occurred while loading dependencies!', error));
//# sourceMappingURL=examples.esm.js.map
