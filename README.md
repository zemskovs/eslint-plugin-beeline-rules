# eslint-plugin-beeline-rules

plugin for production project

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-beeline-rules`:

```sh
npm install eslint-plugin-beeline-rules --save-dev
```

## Usage

Add `beeline-rules` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "beeline-rules"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "beeline-rules/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here


