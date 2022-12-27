# DSL Designs

## Parser
    Parses a given String and returns the result

*Examples*: 
* stringParser("test")
* anyLetter()
* anyDigit()
* ...

## Parser Combinator
    Combines two or more Parsers

*Examples*:
* and
* hidden
* or


## Parser Modifier
    Takes an existing Parser and modifies it

*Examples*:
* .many()
* .hide()
* .try()


## Example Ussage:

```
and([
    hidden([
        stringParser("<?="),
        stringParser(" ").many0(),
        stringParser("$"),
    ]),
    anyLetter().many(),
    hidden([stringParser("[\"")])
    anyLetter().many(),
    hidden([
        stringParser("\"]"),
        stringParser(" ").many0(),
        stringParser("?>"),
    ]),
])
```