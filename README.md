# eslint-plugin-beeline-rules-tets

Тестовая реализация набора правил beeline для фронтенд разработки

## Установка

Для начала нужно установить eslint [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Далее установить плагин `eslint-plugin-beeline-rules-test`:

```sh
npm install eslint-plugin-beeline-rules-test --save-dev
```

## Использование

Необходимо добавить `beeline-rules-test` в секцию плагинов в `.eslintrc`. Приставку `eslint-plugin-` можно пропустить:

```json
{
    "plugins": [
        "beeline-rules-test"
    ]
}
```


Для настройки правил воспользуйтесь соответствующей секцией

```json
{
    "rules": {
        "beeline-rules-test/rule-name": 2
    }
}
```

## Поддерживаемые правила

* Fill in provided rules here


