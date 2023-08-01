"use strict";

const { isComponentName } = require('../helpers/index');

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Ограничение количества props в React компоненте",
      category: "Best Practices",
      recommended: true,
    },
    fixable: null,
    schema: [
      {
        type: "object",
        properties: {
          maxProps: {
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
    const maxProps = options.maxProps || 10;

    return {
      VariableDeclarator(node) {
        if (node.init && node.init.type === "ArrowFunctionExpression") {
          const componentName = node.id.name;
          if (!isComponentName(componentName)) return;
          const props = node.init.params[0];

          if (props && props.properties.length > maxProps) {
            context.report({
              node,
              message: `Максимальное число пропсов в компоненте '${componentName}' превышено. Максимум: ${maxProps}.`,
            });
          }
        }
      },
    };
  },
};
