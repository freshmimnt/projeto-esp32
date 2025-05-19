%{
#include <stdio.h>
#include <stdlib.h>
#include "y.tab.h"
%}

%%
[a-zA-Z0-9._%+-]+    { yylval = strdup(yytext); return LOCAL_PART; }
"@"                  { return AT; }
[a-zA-Z0-9.-]+       { yylval = strdup(yytext); return DOMAIN; }
"."                  { return DOT; }
[a-zA-Z]{2,}         { yylval = strdup(yytext); return TLD; }
[ \t\n]             ; /* to skip whitespace */
.                   { return INVALID; }
%%

int yywrap(void) {
    return 1;
} 