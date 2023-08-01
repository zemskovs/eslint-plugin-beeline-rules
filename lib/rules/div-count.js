"use strict";

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Ограничение количества div в React компоненте",
      category: "Best Practices",
      recommended: true,
    },
    fixable: null,
    schema: [
      {
        type: "object",
        properties: {
          maxDiv: {
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
    const maxDiv = options.maxDiv || 3;
    let divCount = 0;

    return {
      JSXOpeningElement(node) {
        // todo: добавить другие тэги
        if (node.name.name === "div") {
          divCount++;

          if (divCount > maxDiv) {
            context.report({
              node,
              message: `Максимальное  число <div> не должно быть больше ${maxDiv}.`,
            });
          }
        }
      },
    };
  },
};
