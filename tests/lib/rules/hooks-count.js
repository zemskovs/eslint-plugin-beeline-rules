/**
 * @fileoverview beeline hook count
 * @author vlad
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/hooks-count"),
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
ruleTester.run("hooks-count", rule, {
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

          return <div></div>
        }`.trim(),
      errors: [
        {
          message:
            "Слшишком много хуков в этом комопоненте. Максимально допустимо 1.",
        },
      ],
    },
  ],
});
