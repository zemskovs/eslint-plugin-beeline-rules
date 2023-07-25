"use strict";

function isHookName(s) {
  return /^use[A-Z0-9]/.test(s);
}

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Ограничение количества хуков в React компоненте",
      category: "Best Practices",
      recommended: true,
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [
      {
        type: "object",
        properties: {
          maxHooks: {
            type: "number",
            minimum: 1,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const maxHooks = options.maxHooks || 1;
    let hookCount = 0;
    let hasReactImport = false;

    function checkHooks(node) {
      if (node.callee && isHookName(node.callee.name)) {
        hookCount++;
      }

      if (hookCount > maxHooks && hasReactImport) {
        context.report({
          node,
          message: `Слшишком много хуков в этом комопоненте. Максимально допустимо ${maxHooks}.`,
        });
      }
    }

    return {
      CallExpression: function (node) {
        if (node.callee && node.callee.type === "Identifier") {
          checkHooks(node);
        }
      },
      ImportDeclaration(node) {
        if (
          node.source.value === "react" &&
          node.specifiers.some(
            (specifier) =>
              specifier.type === "ImportDefaultSpecifier" &&
              specifier.local.name === "React"
          )
        ) {
          hasReactImport = true;
        }
      },
    };
  },
};
