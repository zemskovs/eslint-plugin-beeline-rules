"use strict";

/**
 * Catch all identifiers that begin with "use" followed by an uppercase Latin
 * character to exclude identifiers like "user".
 */

function isHookName(s) {
  return /^use[A-Z0-9]/.test(s);
}

/**
 * We consider hooks to be a hook name identifier or a member expression
 * containing a hook name.
 */

function isHook(node) {
  if (node.type === 'Identifier') {
    return isHookName(node.name);
  } else if (
    node.type === 'MemberExpression' &&
    !node.computed &&
    isHook(node.property)
  ) {
    const obj = node.object;
    const isPascalCaseNameSpace = /^[A-Z].*/;
    return obj.type === 'Identifier' && isPascalCaseNameSpace.test(obj.name);
  } else {
    return false;
  }
}

function isInsideComponent(node) {
  while (node) {
    const functionName = getFunctionName(node);
    if (functionName) {
      if (isHook(functionName)) {
        return true;
      }
    }
    node = node.parent;
  }
  return false;
}


module.exports = {
  meta: {
    type: 'problem', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "beeline hooks count",
      recommended: true,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },

  create(context) {
    const hooksFunctions = new WeakSet();

    function recordAllHooksFunctions(scope) {
      for (const reference of scope.references) {
        const parent = reference.identifier.parent;
        if (
          parent.type === 'VariableDeclarator' &&
          parent.init &&
          parent.init.type === 'CallExpression' &&
          parent.init.callee &&
          isHook(parent.init.callee)
        ) {
          for (const ref of reference.resolved.references) {
            if (ref !== reference) {
              hooksFunctions.add(ref.identifier);
            }
          }
        }
      }
    }

    return {
      FunctionDeclaration(node) {
        // function MyComponent() { const onClick = useEffectEvent(...) }
        if (isInsideComponent(node)) {
          recordAllHooksFunctions(context.getScope());
        }
      },

      ArrowFunctionExpression(node) {
        // const MyComponent = () => { const onClick = useEffectEvent(...) }
        if (isInsideComponent(node)) {
          recordAllHooksFunctions(context.getScope());
        }
      },

      onCodePathEnd() {
        if(Object.keys(hooksFunctions).length > 3) {
          context.add('Слишком много хуков 😞')
        }
      }
    };
  },
};

/**
 * Gets the static name of a function AST node. For function declarations it is
 * easy. For anonymous function expressions it is much harder. If you search for
 * `IsAnonymousFunctionDefinition()` in the ECMAScript spec you'll find places
 * where JS gives anonymous function expressions names. We roughly detect the
 * same AST nodes with some exceptions to better fit our use case.
 */

function getFunctionName(node) {
  if (
    node.type === 'FunctionDeclaration' ||
    (node.type === 'FunctionExpression' && node.id)
  ) {
    // function useHook() {}
    // const whatever = function useHook() {};
    //
    // Function declaration or function expression names win over any
    // assignment statements or other renames.
    return node.id;
  } else if (
    node.type === 'FunctionExpression' ||
    node.type === 'ArrowFunctionExpression'
  ) {
    if (
      node.parent.type === 'VariableDeclarator' &&
      node.parent.init === node
    ) {
      // const useHook = () => {};
      return node.parent.id;
    } else if (
      node.parent.type === 'AssignmentExpression' &&
      node.parent.right === node &&
      node.parent.operator === '='
    ) {
      // useHook = () => {};
      return node.parent.left;
    } else if (
      node.parent.type === 'Property' &&
      node.parent.value === node &&
      !node.parent.computed
    ) {
      // {useHook: () => {}}
      // {useHook() {}}
      return node.parent.key;

      // NOTE: We could also support `ClassProperty` and `MethodDefinition`
      // here to be pedantic. However, hooks in a class are an anti-pattern. So
      // we don't allow it to error early.
      //
      // class {useHook = () => {}}
      // class {useHook() {}}
    } else if (
      node.parent.type === 'AssignmentPattern' &&
      node.parent.right === node &&
      !node.parent.computed
    ) {
      // const {useHook = () => {}} = {};
      // ({useHook = () => {}} = {});
      //
      // Kinda clowny, but we'd said we'd follow spec convention for
      // `IsAnonymousFunctionDefinition()` usage.
      return node.parent.left;
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

