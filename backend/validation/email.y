%{
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void yyerror(const char *s);
int yylex(void);
int valid = 0;
%}

%token LOCAL_PART AT DOMAIN DOT TLD INVALID

%%
email: LOCAL_PART AT DOMAIN DOT TLD { valid = 1; }
     | error                        { valid = 0; }
     ;
%%

void yyerror(const char *s) {
    fprintf(stderr, "Error: %s\n", s);
    valid = 0;
}

int main(void) {
    yyparse();
    return valid ? 0 : 1;
} 