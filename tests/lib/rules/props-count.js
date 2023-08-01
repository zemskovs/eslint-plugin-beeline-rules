/**
 * @fileoverview beeline hook count
 * @author vlad
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/div-count"),
  RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
      modules: true,
      experimentalObjectRestSpread: true,
    },
  },
});
ruleTester.run("div-count", rule, {
  valid: [
    `
    import React, { useState } from 'react';

    const SimpleComponent = () => {
      const [count, setCount] = useState();

      return <div></div>
    }`.trim(),
  ],

  invalid: [
    {
      code: `
        import React, { useState } from 'react';

        const SimpleComponent = () => {
          const [count, setCount] = useState();
          const [time, setTime] = useState();

          return (
            <div>
              <div>
                <div>
                  <div></div>
                </div>
              </div>
            </div>
          )
        }`.trim(),
      errors: [
        {
          message:
            "Максимальное  число <div> не должно быть больше 3.",
        },
      ],
    },
  ],
});
