import { CProgramLesson } from '../core/types';
import {
  generateBasicsTrace,
  generateConditionTrace,
  generateNumberTrace,
  generatePatternTrace,
  generateArrayTrace,
  generateMatrixTrace,
  generateStringTrace,
} from '../traces/cTraceGenerators';

export const ALL_C_LESSONS: CProgramLesson[] = [
  {
    "id": "c-lesson-1",
    "slug": "matrix-0-and-1-present",
    "title": "0 And 1 Present",
    "category": "matrix",
    "categoryFolder": "2-D Matrix",
    "categoryDisplay": "2-D Matrix Operations",
    "originalFilename": "0_and_1_present.c",
    "originalPath": "FUNDAMENTALS OF C/2-D Matrix/0_and_1_present.c",
    "originalSource": "//HOW many 0 and 1 is Present in a Matrix\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j,r,c,o=0,z=0;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    int a[r][c];\r\n    printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n    //input\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n        {\r\n            printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n            scanf(\"%d\",&a[i][j]);\r\n        }\r\n    }\r\n    //output\r\n    printf(\"The Matrix is = \\n\");\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n        {\r\n            printf(\"%d \",a[i][j]);\r\n            if(a[i][j]==1)\r\n                o++;\r\n            else if(a[i][j]==0)\r\n                z++;\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n    printf(\"No of 1 = %d\\nNo of 0 = %d\",o,z);\r\n}",
    "learningSource": "//HOW many 0 and 1 is Present in a Matrix\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j,r,c,o=0,z=0;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    int a[r][c];\r\n    printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n    //input\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n        {\r\n            printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n            scanf(\"%d\",&a[i][j]);\r\n        }\r\n    }\r\n    //output\r\n    printf(\"The Matrix is = \\n\");\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n        {\r\n            printf(\"%d \",a[i][j]);\r\n            if(a[i][j]==1)\r\n                o++;\r\n            else if(a[i][j]==0)\r\n                z++;\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n    printf(\"No of 1 = %d\\nNo of 0 = %d\",o,z);\r\n\n    return 0;\n}",
    "description": "C educational implementation for 0 And 1 Present from 2-D Matrix in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for 0 And 1 Present.",
    "tags": [
      "c",
      "matrix",
      "0-and-1-present"
    ],
    "difficulty": "medium",
    "defaultInput": "1 2 3 4",
    "presets": [
      {
        "label": "Default Input",
        "value": "1 2 3 4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "matrix",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-2",
    "slug": "matrix-addition",
    "title": "Addition",
    "category": "matrix",
    "categoryFolder": "2-D Matrix",
    "categoryDisplay": "2-D Matrix Operations",
    "originalFilename": "Addition.c",
    "originalPath": "FUNDAMENTALS OF C/2-D Matrix/Addition.c",
    "originalSource": "//Matrix ADDITION\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j,r1,c1,r2,c2;\r\n    printf(\"Enter the Row and Column No for 1st & 2nd Matrix= \");\r\n    scanf(\"%d%d%d%d\",&r1,&c1,&r2,&c2);\r\n    if(r1==r2 && c1==c2)\r\n    {\r\n        int a[r1][c1],b[r2][c2];\r\n        printf(\"Enter the Elements for %dX%d matrix= \\n\",r1,c1);\r\n        //input\r\n        for(i=0;i<r1;i++)\r\n        {\r\n            for(j=0;j<c1;j++)\r\n            {\r\n                printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n                scanf(\"%d\",&a[i][j]);\r\n            }\r\n        }\r\n        printf(\"Enter the Elements for %dX%d matrix= \\n\",r2,c2);\r\n        //input\r\n        for(i=0;i<r2;i++)\r\n        {\r\n            for(j=0;j<c2;j++)\r\n            {\r\n                printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n                scanf(\"%d\",&b[i][j]);\r\n            }\r\n        }\r\n        //output\r\n        printf(\"The 1st Matrix is = \\n\");\r\n        for(i=0;i<r1;i++)\r\n        {\r\n            for(j=0;j<c1;j++)\r\n                printf(\"%d \",a[i][j]);\r\n            printf(\"\\n\");\r\n        }\r\n        printf(\"The 2nd Matrix is = \\n\");\r\n        for(i=0;i<r2;i++)   \r\n        { \r\n            for(j=0;j<c2;j++)\r\n                printf(\"%d \",b[i][j]);\r\n            printf(\"\\n\");\r\n        }\r\n        //ADDITION\r\n        printf(\"The Resultant Matrix is = \\n\");\r\n        for(i=0;i<r2;i++)\r\n        {\r\n            for(j=0;j<c2;j++)\r\n                printf(\"%d \",a[i][j]+b[i][j]);\r\n            printf(\"\\n\");\r\n        }\r\n    }\r\n    else\r\n        printf(\"1st & 2nd matrix's row and Column no are not same,so not possible\");\r\n}",
    "learningSource": "//Matrix ADDITION\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j,r1,c1,r2,c2;\r\n    printf(\"Enter the Row and Column No for 1st & 2nd Matrix= \");\r\n    scanf(\"%d%d%d%d\",&r1,&c1,&r2,&c2);\r\n    if(r1==r2 && c1==c2)\r\n    {\r\n        int a[r1][c1],b[r2][c2];\r\n        printf(\"Enter the Elements for %dX%d matrix= \\n\",r1,c1);\r\n        //input\r\n        for(i=0;i<r1;i++)\r\n        {\r\n            for(j=0;j<c1;j++)\r\n            {\r\n                printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n                scanf(\"%d\",&a[i][j]);\r\n            }\r\n        }\r\n        printf(\"Enter the Elements for %dX%d matrix= \\n\",r2,c2);\r\n        //input\r\n        for(i=0;i<r2;i++)\r\n        {\r\n            for(j=0;j<c2;j++)\r\n            {\r\n                printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n                scanf(\"%d\",&b[i][j]);\r\n            }\r\n        }\r\n        //output\r\n        printf(\"The 1st Matrix is = \\n\");\r\n        for(i=0;i<r1;i++)\r\n        {\r\n            for(j=0;j<c1;j++)\r\n                printf(\"%d \",a[i][j]);\r\n            printf(\"\\n\");\r\n        }\r\n        printf(\"The 2nd Matrix is = \\n\");\r\n        for(i=0;i<r2;i++)   \r\n        { \r\n            for(j=0;j<c2;j++)\r\n                printf(\"%d \",b[i][j]);\r\n            printf(\"\\n\");\r\n        }\r\n        //ADDITION\r\n        printf(\"The Resultant Matrix is = \\n\");\r\n        for(i=0;i<r2;i++)\r\n        {\r\n            for(j=0;j<c2;j++)\r\n                printf(\"%d \",a[i][j]+b[i][j]);\r\n            printf(\"\\n\");\r\n        }\r\n    }\r\n    else\r\n        printf(\"1st & 2nd matrix's row and Column no are not same,so not possible\");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Addition from 2-D Matrix in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Addition.",
    "tags": [
      "c",
      "matrix",
      "addition"
    ],
    "difficulty": "medium",
    "defaultInput": "1 2 3 4",
    "presets": [
      {
        "label": "Default Input",
        "value": "1 2 3 4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "matrix",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-3",
    "slug": "matrix-columnwise-sum",
    "title": "Columnwise Sum",
    "category": "matrix",
    "categoryFolder": "2-D Matrix",
    "categoryDisplay": "2-D Matrix Operations",
    "originalFilename": "Columnwise_sum.c",
    "originalPath": "FUNDAMENTALS OF C/2-D Matrix/Columnwise_sum.c",
    "originalSource": "//WAP to take input in a 2-D matrix and print it's Rowwise Sum\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j,r,c,s=0,k=1;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    int a[r][c];\r\n    printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n    //input\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n        {\r\n            printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n            scanf(\"%d\",&a[i][j]);\r\n        }\r\n    }\r\n    //output\r\n    printf(\"The Matrix is = \\n\");\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n            printf(\"%d \",a[i][j]);\r\n        printf(\"\\n\");\r\n    }\r\n    printf(\"The Columnwise Sum\\n\");\r\n    for(i=0;i<c;i++)\r\n    {\r\n        for(j=0;j<r;j++)\r\n            s+=a[j][i];\r\n        printf(\"Sum of %d No Row is = %d\",k++,s);\r\n        s=0;\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "//WAP to take input in a 2-D matrix and print it's Rowwise Sum\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j,r,c,s=0,k=1;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    int a[r][c];\r\n    printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n    //input\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n        {\r\n            printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n            scanf(\"%d\",&a[i][j]);\r\n        }\r\n    }\r\n    //output\r\n    printf(\"The Matrix is = \\n\");\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n            printf(\"%d \",a[i][j]);\r\n        printf(\"\\n\");\r\n    }\r\n    printf(\"The Columnwise Sum\\n\");\r\n    for(i=0;i<c;i++)\r\n    {\r\n        for(j=0;j<r;j++)\r\n            s+=a[j][i];\r\n        printf(\"Sum of %d No Row is = %d\",k++,s);\r\n        s=0;\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Columnwise Sum from 2-D Matrix in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Columnwise Sum.",
    "tags": [
      "c",
      "matrix",
      "columnwise-sum",
      "total",
      "addition",
      "add"
    ],
    "difficulty": "medium",
    "defaultInput": "1 2 3 4",
    "presets": [
      {
        "label": "Default Input",
        "value": "1 2 3 4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "matrix",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-4",
    "slug": "matrix-diagonal",
    "title": "Diagonal",
    "category": "matrix",
    "categoryFolder": "2-D Matrix",
    "categoryDisplay": "2-D Matrix Operations",
    "originalFilename": "Diagonal.c",
    "originalPath": "FUNDAMENTALS OF C/2-D Matrix/Diagonal.c",
    "originalSource": "/*Print Diagonal\r\nI/P:1 2 3 \r\n    4 5 6\r\n    7 8 9 \r\nO/P:1   \r\n      5\r\n        9\r\n\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j,r,c;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    if(r==c)\r\n    {\r\n        int a[r][c];\r\n        printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n        //input\r\n        for(i=0;i<r;i++)\r\n        {\r\n            for(j=0;j<c;j++)\r\n            {\r\n                printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n                scanf(\"%d\",&a[i][j]);\r\n            }\r\n        }\r\n        //output\r\n        printf(\"The Matrix is = \\n\");\r\n        for(i=0;i<r;i++)\r\n        {\r\n            for(j=0;j<c;j++)\r\n                printf(\"%d \",a[i][j]);\r\n            printf(\"\\n\");\r\n        }\r\n        //print Diagonal\r\n        printf(\"The Diagonal of Matrix is = \\n\");\r\n        for(i=0;i<r;i++)\r\n        {\r\n           for(j=0;j<c;j++)\r\n               (i==j)?printf(\"%d \",a[i][j]):printf(\"  \");\r\n           printf(\"\\n\");\r\n       }\r\n    }\r\n    else\r\n        printf(\"Row & Column No are not Equal, So not possible\");\r\n}",
    "learningSource": "/*Print Diagonal\r\nI/P:1 2 3 \r\n    4 5 6\r\n    7 8 9 \r\nO/P:1   \r\n      5\r\n        9\r\n\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j,r,c;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    if(r==c)\r\n    {\r\n        int a[r][c];\r\n        printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n        //input\r\n        for(i=0;i<r;i++)\r\n        {\r\n            for(j=0;j<c;j++)\r\n            {\r\n                printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n                scanf(\"%d\",&a[i][j]);\r\n            }\r\n        }\r\n        //output\r\n        printf(\"The Matrix is = \\n\");\r\n        for(i=0;i<r;i++)\r\n        {\r\n            for(j=0;j<c;j++)\r\n                printf(\"%d \",a[i][j]);\r\n            printf(\"\\n\");\r\n        }\r\n        //print Diagonal\r\n        printf(\"The Diagonal of Matrix is = \\n\");\r\n        for(i=0;i<r;i++)\r\n        {\r\n           for(j=0;j<c;j++)\r\n               (i==j)?printf(\"%d \",a[i][j]):printf(\"  \");\r\n           printf(\"\\n\");\r\n       }\r\n    }\r\n    else\r\n        printf(\"Row & Column No are not Equal, So not possible\");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Diagonal from 2-D Matrix in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Diagonal.",
    "tags": [
      "c",
      "matrix",
      "diagonal"
    ],
    "difficulty": "medium",
    "defaultInput": "1 2 3 4",
    "presets": [
      {
        "label": "Default Input",
        "value": "1 2 3 4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "matrix",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-5",
    "slug": "matrix-lower-left-triangle",
    "title": "Lower Left Triangle",
    "category": "matrix",
    "categoryFolder": "2-D Matrix",
    "categoryDisplay": "2-D Matrix Operations",
    "originalFilename": "Lower-Left-Triangle.c",
    "originalPath": "FUNDAMENTALS OF C/2-D Matrix/Lower-Left-Triangle.c",
    "originalSource": "//Lower Left triangle\r\n/*\r\n    1\r\n    4   5\r\n    7   8   9\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j,r,c;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    if(r==c)\r\n    {\r\n        int a[r][c];\r\n        printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n        //input\r\n        for(i=0;i<r;i++)\r\n        {\r\n            for(j=0;j<c;j++)\r\n            {\r\n                printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n                scanf(\"%d\",&a[i][j]);\r\n            }\r\n        }\r\n        //output\r\n        printf(\"The Matrix is = \\n\");\r\n        for(i=0;i<r;i++)\r\n        {\r\n                for(j=0;j<c;j++)\r\n                printf(\"%d \",a[i][j]);\r\n                printf(\"\\n\");\r\n        }\r\n        //Lower Left triangle\r\n        printf(\"Lower Left Triangle\\n\");\r\n        for(i=0;i<r;i++)\r\n        {\r\n            for(j=0;j<c;j++)\r\n                (i>=j)?printf(\"%d \",a[i][j]):printf(\"  \");\r\n            printf(\"\\n\");\r\n        }\r\n    }\r\n    else\r\n        printf(\"1st & 2nd matrix's row and Column no are not same,so not possible\");\r\n}",
    "learningSource": "//Lower Left triangle\r\n/*\r\n    1\r\n    4   5\r\n    7   8   9\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j,r,c;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    if(r==c)\r\n    {\r\n        int a[r][c];\r\n        printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n        //input\r\n        for(i=0;i<r;i++)\r\n        {\r\n            for(j=0;j<c;j++)\r\n            {\r\n                printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n                scanf(\"%d\",&a[i][j]);\r\n            }\r\n        }\r\n        //output\r\n        printf(\"The Matrix is = \\n\");\r\n        for(i=0;i<r;i++)\r\n        {\r\n                for(j=0;j<c;j++)\r\n                printf(\"%d \",a[i][j]);\r\n                printf(\"\\n\");\r\n        }\r\n        //Lower Left triangle\r\n        printf(\"Lower Left Triangle\\n\");\r\n        for(i=0;i<r;i++)\r\n        {\r\n            for(j=0;j<c;j++)\r\n                (i>=j)?printf(\"%d \",a[i][j]):printf(\"  \");\r\n            printf(\"\\n\");\r\n        }\r\n    }\r\n    else\r\n        printf(\"1st & 2nd matrix's row and Column no are not same,so not possible\");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Lower Left Triangle from 2-D Matrix in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Lower Left Triangle.",
    "tags": [
      "c",
      "matrix",
      "lower-left-triangle"
    ],
    "difficulty": "medium",
    "defaultInput": "1 2 3 4",
    "presets": [
      {
        "label": "Default Input",
        "value": "1 2 3 4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "matrix",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-6",
    "slug": "matrix-lower-right-triangle",
    "title": "Lower Right Triangle",
    "category": "matrix",
    "categoryFolder": "2-D Matrix",
    "categoryDisplay": "2-D Matrix Operations",
    "originalFilename": "Lower-Right-triangle.c",
    "originalPath": "FUNDAMENTALS OF C/2-D Matrix/Lower-Right-triangle.c",
    "originalSource": "//Lower Right triangle\r\n/*\r\n    1\r\n    4   5\r\n    7   8   9\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j,r,c;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    if(r==c)\r\n    {\r\n        int a[r][c];\r\n        printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n        //input\r\n        for(i=0;i<r;i++)\r\n        {\r\n            for(j=0;j<c;j++)\r\n            {\r\n                printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n                scanf(\"%d\",&a[i][j]);\r\n            }\r\n        }\r\n        //output\r\n        printf(\"The Matrix is = \\n\");\r\n        for(i=0;i<r;i++)\r\n        {\r\n                for(j=0;j<c;j++)\r\n                printf(\"%d \",a[i][j]);\r\n                printf(\"\\n\");\r\n        }\r\n        //Lower Right triangle\r\n        printf(\"Lower Right Triangle\\n\");\r\n        for(i=0;i<r;i++)\r\n        {\r\n            for(j=0;j<c;j++)\r\n                ((i+j)>=r-1)?printf(\"%d \",a[i][j]):printf(\"  \");\r\n            printf(\"\\n\");\r\n        }\r\n    }\r\n    else\r\n        printf(\"1st & 2nd matrix's row and Column no are not same,so not possible\");\r\n}",
    "learningSource": "//Lower Right triangle\r\n/*\r\n    1\r\n    4   5\r\n    7   8   9\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j,r,c;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    if(r==c)\r\n    {\r\n        int a[r][c];\r\n        printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n        //input\r\n        for(i=0;i<r;i++)\r\n        {\r\n            for(j=0;j<c;j++)\r\n            {\r\n                printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n                scanf(\"%d\",&a[i][j]);\r\n            }\r\n        }\r\n        //output\r\n        printf(\"The Matrix is = \\n\");\r\n        for(i=0;i<r;i++)\r\n        {\r\n                for(j=0;j<c;j++)\r\n                printf(\"%d \",a[i][j]);\r\n                printf(\"\\n\");\r\n        }\r\n        //Lower Right triangle\r\n        printf(\"Lower Right Triangle\\n\");\r\n        for(i=0;i<r;i++)\r\n        {\r\n            for(j=0;j<c;j++)\r\n                ((i+j)>=r-1)?printf(\"%d \",a[i][j]):printf(\"  \");\r\n            printf(\"\\n\");\r\n        }\r\n    }\r\n    else\r\n        printf(\"1st & 2nd matrix's row and Column no are not same,so not possible\");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Lower Right Triangle from 2-D Matrix in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Lower Right Triangle.",
    "tags": [
      "c",
      "matrix",
      "lower-right-triangle"
    ],
    "difficulty": "medium",
    "defaultInput": "1 2 3 4",
    "presets": [
      {
        "label": "Default Input",
        "value": "1 2 3 4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "matrix",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-7",
    "slug": "matrix-multiplication",
    "title": "Multiplication",
    "category": "matrix",
    "categoryFolder": "2-D Matrix",
    "categoryDisplay": "2-D Matrix Operations",
    "originalFilename": "Multiplication.c",
    "originalPath": "FUNDAMENTALS OF C/2-D Matrix/Multiplication.c",
    "originalSource": "//Matrix Multiplication\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j,r1,c1,r2,c2,s=0,d;\r\n    printf(\"Enter the Row and Column No for 1st & 2nd Matrix= \");\r\n    scanf(\"%d%d%d%d\",&r1,&c1,&r2,&c2);\r\n    if(r1==c2 && c1==r2)\r\n    {\r\n        int a[r1][c1],b[r2][c2],m[r1][c2];\r\n        printf(\"Enter the Elements for %dX%d matrix= \\n\",r1,c1);\r\n        //input\r\n        for(i=0;i<r1;i++)\r\n        {\r\n            for(j=0;j<c1;j++)\r\n            {\r\n                printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n                scanf(\"%d\",&a[i][j]);\r\n            }\r\n        }\r\n        printf(\"Enter the Elements for %dX%d matrix= \\n\",r2,c2);\r\n        //input\r\n        for(i=0;i<r2;i++)\r\n        {\r\n            for(j=0;j<c2;j++)\r\n            {\r\n                printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n                scanf(\"%d\",&b[i][j]);\r\n            }\r\n        }\r\n        //output\r\n        printf(\"The 1st Matrix is = \\n\");\r\n        for(i=0;i<r1;i++)\r\n        {\r\n            for(j=0;j<c1;j++)\r\n                printf(\"%d \",a[i][j]);\r\n            printf(\"\\n\");\r\n        }\r\n        printf(\"The 2nd Matrix is = \\n\");\r\n        for(i=0;i<r2;i++)   \r\n        { \r\n            for(j=0;j<c2;j++)\r\n                printf(\"%d \",b[i][j]);\r\n            printf(\"\\n\");\r\n        }\r\n        //Multiplication\r\n        printf(\"The Resultant Matrix is = \\n\");\r\n        for(i=0;i<r1;i++)\r\n        {\r\n            for(d=0;d<c2;d++)\r\n            {\r\n                for(j=0;j<r2;j++)\r\n                    s+=a[i][j]*b[j][d]; \r\n                printf(\"%d \",s);\r\n                s=0;  \r\n            }\r\n            printf(\"\\n\");\r\n        }\r\n    }\r\n    else\r\n        printf(\"1st & 2nd matrix's row and Column no are not same,so not possible\");\r\n}",
    "learningSource": "//Matrix Multiplication\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j,r1,c1,r2,c2,s=0,d;\r\n    printf(\"Enter the Row and Column No for 1st & 2nd Matrix= \");\r\n    scanf(\"%d%d%d%d\",&r1,&c1,&r2,&c2);\r\n    if(r1==c2 && c1==r2)\r\n    {\r\n        int a[r1][c1],b[r2][c2],m[r1][c2];\r\n        printf(\"Enter the Elements for %dX%d matrix= \\n\",r1,c1);\r\n        //input\r\n        for(i=0;i<r1;i++)\r\n        {\r\n            for(j=0;j<c1;j++)\r\n            {\r\n                printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n                scanf(\"%d\",&a[i][j]);\r\n            }\r\n        }\r\n        printf(\"Enter the Elements for %dX%d matrix= \\n\",r2,c2);\r\n        //input\r\n        for(i=0;i<r2;i++)\r\n        {\r\n            for(j=0;j<c2;j++)\r\n            {\r\n                printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n                scanf(\"%d\",&b[i][j]);\r\n            }\r\n        }\r\n        //output\r\n        printf(\"The 1st Matrix is = \\n\");\r\n        for(i=0;i<r1;i++)\r\n        {\r\n            for(j=0;j<c1;j++)\r\n                printf(\"%d \",a[i][j]);\r\n            printf(\"\\n\");\r\n        }\r\n        printf(\"The 2nd Matrix is = \\n\");\r\n        for(i=0;i<r2;i++)   \r\n        { \r\n            for(j=0;j<c2;j++)\r\n                printf(\"%d \",b[i][j]);\r\n            printf(\"\\n\");\r\n        }\r\n        //Multiplication\r\n        printf(\"The Resultant Matrix is = \\n\");\r\n        for(i=0;i<r1;i++)\r\n        {\r\n            for(d=0;d<c2;d++)\r\n            {\r\n                for(j=0;j<r2;j++)\r\n                    s+=a[i][j]*b[j][d]; \r\n                printf(\"%d \",s);\r\n                s=0;  \r\n            }\r\n            printf(\"\\n\");\r\n        }\r\n    }\r\n    else\r\n        printf(\"1st & 2nd matrix's row and Column no are not same,so not possible\");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Multiplication from 2-D Matrix in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Multiplication.",
    "tags": [
      "c",
      "matrix",
      "multiplication"
    ],
    "difficulty": "medium",
    "defaultInput": "1 2 3 4",
    "presets": [
      {
        "label": "Default Input",
        "value": "1 2 3 4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "matrix",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-8",
    "slug": "matrix-print-matrix",
    "title": "Print Matrix",
    "category": "matrix",
    "categoryFolder": "2-D Matrix",
    "categoryDisplay": "2-D Matrix Operations",
    "originalFilename": "print_matrix.c",
    "originalPath": "FUNDAMENTALS OF C/2-D Matrix/print_matrix.c",
    "originalSource": "//WAP to take input in a 2-D matrix and print it\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j,r,c;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    int a[r][c];\r\n    printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n    //input\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n        {\r\n            printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n            scanf(\"%d\",&a[i][j]);\r\n        }\r\n    }\r\n    //output\r\n    printf(\"The Matrix is = \\n\");\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n            printf(\"%d \",a[i][j]);\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "//WAP to take input in a 2-D matrix and print it\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j,r,c;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    int a[r][c];\r\n    printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n    //input\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n        {\r\n            printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n            scanf(\"%d\",&a[i][j]);\r\n        }\r\n    }\r\n    //output\r\n    printf(\"The Matrix is = \\n\");\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n            printf(\"%d \",a[i][j]);\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Print Matrix from 2-D Matrix in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Print Matrix.",
    "tags": [
      "c",
      "matrix",
      "print-matrix",
      "2d array",
      "grid",
      "rows",
      "columns"
    ],
    "difficulty": "medium",
    "defaultInput": "1 2 3 4",
    "presets": [
      {
        "label": "Default Input",
        "value": "1 2 3 4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "matrix",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-9",
    "slug": "matrix-rowwise-sum",
    "title": "Rowwise Sum",
    "category": "matrix",
    "categoryFolder": "2-D Matrix",
    "categoryDisplay": "2-D Matrix Operations",
    "originalFilename": "Rowwise_sum.c",
    "originalPath": "FUNDAMENTALS OF C/2-D Matrix/Rowwise_sum.c",
    "originalSource": "//WAP to take input in a 2-D matrix and print it's Rowwise Sum\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j,r,c,s=0,k=1;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    int a[r][c];\r\n    printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n    //input\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n        {\r\n            printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n            scanf(\"%d\",&a[i][j]);\r\n        }\r\n    }\r\n    //output\r\n    printf(\"The Matrix is = \\n\");\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n            printf(\"%d \",a[i][j]);\r\n        printf(\"\\n\");\r\n    }\r\n    printf(\"The Rowwise Sum\\n\");\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n            s+=a[i][j];\r\n        printf(\"Sum of %d No Row is = %d\",k++,s);\r\n        s=0;\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "//WAP to take input in a 2-D matrix and print it's Rowwise Sum\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j,r,c,s=0,k=1;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    int a[r][c];\r\n    printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n    //input\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n        {\r\n            printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n            scanf(\"%d\",&a[i][j]);\r\n        }\r\n    }\r\n    //output\r\n    printf(\"The Matrix is = \\n\");\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n            printf(\"%d \",a[i][j]);\r\n        printf(\"\\n\");\r\n    }\r\n    printf(\"The Rowwise Sum\\n\");\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n            s+=a[i][j];\r\n        printf(\"Sum of %d No Row is = %d\",k++,s);\r\n        s=0;\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Rowwise Sum from 2-D Matrix in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Rowwise Sum.",
    "tags": [
      "c",
      "matrix",
      "rowwise-sum",
      "total",
      "addition",
      "add"
    ],
    "difficulty": "medium",
    "defaultInput": "1 2 3 4",
    "presets": [
      {
        "label": "Default Input",
        "value": "1 2 3 4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "matrix",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-10",
    "slug": "matrix-skew-symmetric",
    "title": "SKEW Symmetric",
    "category": "matrix",
    "categoryFolder": "2-D Matrix",
    "categoryDisplay": "2-D Matrix Operations",
    "originalFilename": "SKEW-Symmetric.c",
    "originalPath": "FUNDAMENTALS OF C/2-D Matrix/SKEW-Symmetric.c",
    "originalSource": "//SKEW Symmetric Matrix\r\n/*\r\n    SKEW Symmetric:\r\n                    1   2   3\r\n                   -2   5   6\r\n                   -3  -6   7\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j,r,c,f=0;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    if(r==c)\r\n    {\r\n        int a[r][c];\r\n    printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n    //input\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n        {\r\n            printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n            scanf(\"%d\",&a[i][j]);\r\n        }\r\n    }\r\n    //output\r\n    printf(\"The Matrix is = \\n\");\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n            printf(\"%d \",a[i][j]);\r\n        printf(\"\\n\");\r\n    }\r\n    //SKEW Symmetric\r\n    for(i=0;i<c;i++)\r\n        for(j=0;j<r;j++)\r\n            if(i!=j)\r\n                if(a[i][j]!=a[j][i]*(-1))\r\n                {\r\n                    f=1;\r\n                    break;\r\n                }\r\n    if(f==0)\r\n        printf(\"it is a SKEW Symmetric Matrix\");\r\n    else\r\n        printf(\"it is NOT a SKEW Symmetric Matrix\");\r\n    }\r\n    else\r\n        printf(\"1st & 2nd matrix's row and Column no are not same,so not possible\");\r\n}",
    "learningSource": "//SKEW Symmetric Matrix\r\n/*\r\n    SKEW Symmetric:\r\n                    1   2   3\r\n                   -2   5   6\r\n                   -3  -6   7\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j,r,c,f=0;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    if(r==c)\r\n    {\r\n        int a[r][c];\r\n    printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n    //input\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n        {\r\n            printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n            scanf(\"%d\",&a[i][j]);\r\n        }\r\n    }\r\n    //output\r\n    printf(\"The Matrix is = \\n\");\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n            printf(\"%d \",a[i][j]);\r\n        printf(\"\\n\");\r\n    }\r\n    //SKEW Symmetric\r\n    for(i=0;i<c;i++)\r\n        for(j=0;j<r;j++)\r\n            if(i!=j)\r\n                if(a[i][j]!=a[j][i]*(-1))\r\n                {\r\n                    f=1;\r\n                    break;\r\n                }\r\n    if(f==0)\r\n        printf(\"it is a SKEW Symmetric Matrix\");\r\n    else\r\n        printf(\"it is NOT a SKEW Symmetric Matrix\");\r\n    }\r\n    else\r\n        printf(\"1st & 2nd matrix's row and Column no are not same,so not possible\");\r\n\n    return 0;\n}",
    "description": "C educational implementation for SKEW Symmetric from 2-D Matrix in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for SKEW Symmetric.",
    "tags": [
      "c",
      "matrix",
      "skew-symmetric"
    ],
    "difficulty": "medium",
    "defaultInput": "1 2 3 4",
    "presets": [
      {
        "label": "Default Input",
        "value": "1 2 3 4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "matrix",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-11",
    "slug": "matrix-spiral",
    "title": "Spiral",
    "category": "matrix",
    "categoryFolder": "2-D Matrix",
    "categoryDisplay": "2-D Matrix Operations",
    "originalFilename": "Spiral.c",
    "originalPath": "FUNDAMENTALS OF C/2-D Matrix/Spiral.c",
    "originalSource": "#include<stdio.h>\r\nvoid main()\r\n{\r\n    int  r,c,total=1,i,j;\r\n    printf(\"Enter the No of Row and Column = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    int a[r][c],firstcol=0,lastcol=c-1,toprow=0,buttomrow=r-1;\r\n    printf(\"Enter the Element for %d times = \\n\",r*c);\r\n    while(total <= r*c)\r\n    {   \r\n        // left → right\r\n        for(i = firstcol,j = toprow; i <= lastcol && total <= r*c; i++, total++)\r\n            scanf(\"%d\", &a[j][i]);\r\n        toprow++;\r\n        // top → bottom\r\n        for(i = toprow,j = lastcol; i <= buttomrow && total <= r*c; i++, total++)\r\n            scanf(\"%d\", &a[i][j]);\r\n        lastcol--;\r\n        // right → left\r\n        for(i = lastcol,j = buttomrow; i >= firstcol && total <= r*c; i--, total++)\r\n            scanf(\"%d\", &a[j][i]);\r\n        buttomrow--;\r\n        // bottom → top\r\n        for(i = buttomrow, j = firstcol; i >= toprow && total <= r*c; i--, total++)\r\n            scanf(\"%d\", &a[i][j]);\r\n        firstcol++;    \r\n    }\r\n    printf(\"Spiral matrix Is = \\n\");\r\n    for(i = 0; i < r; i++)\r\n    {\r\n        for(j = 0; j < c; j++)\r\n            printf(\"%d\\t\", a[i][j]);\r\n        printf(\"\\n\");\r\n    }\r\n}\r\n",
    "learningSource": "#include<stdio.h>\r\nint main(void)\r\n{\r\n    int  r,c,total=1,i,j;\r\n    printf(\"Enter the No of Row and Column = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    int a[r][c],firstcol=0,lastcol=c-1,toprow=0,buttomrow=r-1;\r\n    printf(\"Enter the Element for %d times = \\n\",r*c);\r\n    while(total <= r*c)\r\n    {   \r\n        // left → right\r\n        for(i = firstcol,j = toprow; i <= lastcol && total <= r*c; i++, total++)\r\n            scanf(\"%d\", &a[j][i]);\r\n        toprow++;\r\n        // top → bottom\r\n        for(i = toprow,j = lastcol; i <= buttomrow && total <= r*c; i++, total++)\r\n            scanf(\"%d\", &a[i][j]);\r\n        lastcol--;\r\n        // right → left\r\n        for(i = lastcol,j = buttomrow; i >= firstcol && total <= r*c; i--, total++)\r\n            scanf(\"%d\", &a[j][i]);\r\n        buttomrow--;\r\n        // bottom → top\r\n        for(i = buttomrow, j = firstcol; i >= toprow && total <= r*c; i--, total++)\r\n            scanf(\"%d\", &a[i][j]);\r\n        firstcol++;    \r\n    }\r\n    printf(\"Spiral matrix Is = \\n\");\r\n    for(i = 0; i < r; i++)\r\n    {\r\n        for(j = 0; j < c; j++)\r\n            printf(\"%d\\t\", a[i][j]);\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Spiral from 2-D Matrix in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Spiral.",
    "tags": [
      "c",
      "matrix",
      "spiral"
    ],
    "difficulty": "medium",
    "defaultInput": "1 2 3 4",
    "presets": [
      {
        "label": "Default Input",
        "value": "1 2 3 4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "matrix",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-12",
    "slug": "matrix-square-matrix",
    "title": "Square Matrix",
    "category": "matrix",
    "categoryFolder": "2-D Matrix",
    "categoryDisplay": "2-D Matrix Operations",
    "originalFilename": "Square-Matrix.c",
    "originalPath": "FUNDAMENTALS OF C/2-D Matrix/Square-Matrix.c",
    "originalSource": "//WAP to take input in a 2-D matrix and print it\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j,r,c;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    int a[r][c];\r\n    printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n    //input\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n        {\r\n            printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n            scanf(\"%d\",&a[i][j]);\r\n        }\r\n    }\r\n    //output\r\n    printf(\"The Matrix is = \\n\");\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n            printf(\"%d \",a[i][j]);\r\n        printf(\"\\n\");\r\n    }\r\n    printf(\"This is%sa Square Matrix\",(c==r)?(\" \"):(\" NOT \"));\r\n}",
    "learningSource": "//WAP to take input in a 2-D matrix and print it\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j,r,c;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    int a[r][c];\r\n    printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n    //input\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n        {\r\n            printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n            scanf(\"%d\",&a[i][j]);\r\n        }\r\n    }\r\n    //output\r\n    printf(\"The Matrix is = \\n\");\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n            printf(\"%d \",a[i][j]);\r\n        printf(\"\\n\");\r\n    }\r\n    printf(\"This is%sa Square Matrix\",(c==r)?(\" \"):(\" NOT \"));\r\n\n    return 0;\n}",
    "description": "C educational implementation for Square Matrix from 2-D Matrix in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Square Matrix.",
    "tags": [
      "c",
      "matrix",
      "square-matrix",
      "2d array",
      "grid",
      "rows",
      "columns"
    ],
    "difficulty": "medium",
    "defaultInput": "1 2 3 4",
    "presets": [
      {
        "label": "Default Input",
        "value": "1 2 3 4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "matrix",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-13",
    "slug": "matrix-subtraction",
    "title": "Subtraction",
    "category": "matrix",
    "categoryFolder": "2-D Matrix",
    "categoryDisplay": "2-D Matrix Operations",
    "originalFilename": "Subtraction.c",
    "originalPath": "FUNDAMENTALS OF C/2-D Matrix/Subtraction.c",
    "originalSource": "//Matrix Subtraction\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j,r1,c1,r2,c2;\r\n    printf(\"Enter the Row and Column No for 1st & 2nd Matrix= \");\r\n    scanf(\"%d%d%d%d\",&r1,&c1,&r2,&c2);\r\n    if(r1==r2 && c1==c2)\r\n    {\r\n        int a[r1][c1],b[r2][c2];\r\n        printf(\"Enter the Elements for %dX%d matrix= \\n\",r1,c1);\r\n        //input\r\n        for(i=0;i<r1;i++)\r\n        {\r\n            for(j=0;j<c1;j++)\r\n            {\r\n                printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n                scanf(\"%d\",&a[i][j]);\r\n            }\r\n        }\r\n        printf(\"Enter the Elements for %dX%d matrix= \\n\",r2,c2);\r\n        //input\r\n        for(i=0;i<r2;i++)\r\n        {\r\n            for(j=0;j<c2;j++)\r\n            {\r\n                printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n                scanf(\"%d\",&b[i][j]);\r\n            }\r\n        }\r\n        //output\r\n        printf(\"The 1st Matrix is = \\n\");\r\n        for(i=0;i<r1;i++)\r\n        {\r\n            for(j=0;j<c1;j++)\r\n                printf(\"%d \",a[i][j]);\r\n            printf(\"\\n\");\r\n        }\r\n        printf(\"The 2nd Matrix is = \\n\");\r\n        for(i=0;i<r2;i++)   \r\n        { \r\n            for(j=0;j<c2;j++)\r\n                printf(\"%d \",b[i][j]);\r\n            printf(\"\\n\");\r\n        }\r\n        //Subtraction\r\n        printf(\"The Resultant Matrix is = \\n\");\r\n        for(i=0;i<r2;i++)\r\n        {\r\n            for(j=0;j<c2;j++)\r\n                printf(\"%d \",a[i][j]-b[i][j]);\r\n            printf(\"\\n\");\r\n        }\r\n    }\r\n    else\r\n        printf(\"1st & 2nd matrix's row and Column no are not same,so not possible\");\r\n}",
    "learningSource": "//Matrix Subtraction\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j,r1,c1,r2,c2;\r\n    printf(\"Enter the Row and Column No for 1st & 2nd Matrix= \");\r\n    scanf(\"%d%d%d%d\",&r1,&c1,&r2,&c2);\r\n    if(r1==r2 && c1==c2)\r\n    {\r\n        int a[r1][c1],b[r2][c2];\r\n        printf(\"Enter the Elements for %dX%d matrix= \\n\",r1,c1);\r\n        //input\r\n        for(i=0;i<r1;i++)\r\n        {\r\n            for(j=0;j<c1;j++)\r\n            {\r\n                printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n                scanf(\"%d\",&a[i][j]);\r\n            }\r\n        }\r\n        printf(\"Enter the Elements for %dX%d matrix= \\n\",r2,c2);\r\n        //input\r\n        for(i=0;i<r2;i++)\r\n        {\r\n            for(j=0;j<c2;j++)\r\n            {\r\n                printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n                scanf(\"%d\",&b[i][j]);\r\n            }\r\n        }\r\n        //output\r\n        printf(\"The 1st Matrix is = \\n\");\r\n        for(i=0;i<r1;i++)\r\n        {\r\n            for(j=0;j<c1;j++)\r\n                printf(\"%d \",a[i][j]);\r\n            printf(\"\\n\");\r\n        }\r\n        printf(\"The 2nd Matrix is = \\n\");\r\n        for(i=0;i<r2;i++)   \r\n        { \r\n            for(j=0;j<c2;j++)\r\n                printf(\"%d \",b[i][j]);\r\n            printf(\"\\n\");\r\n        }\r\n        //Subtraction\r\n        printf(\"The Resultant Matrix is = \\n\");\r\n        for(i=0;i<r2;i++)\r\n        {\r\n            for(j=0;j<c2;j++)\r\n                printf(\"%d \",a[i][j]-b[i][j]);\r\n            printf(\"\\n\");\r\n        }\r\n    }\r\n    else\r\n        printf(\"1st & 2nd matrix's row and Column no are not same,so not possible\");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Subtraction from 2-D Matrix in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Subtraction.",
    "tags": [
      "c",
      "matrix",
      "subtraction"
    ],
    "difficulty": "medium",
    "defaultInput": "1 2 3 4",
    "presets": [
      {
        "label": "Default Input",
        "value": "1 2 3 4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "matrix",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-14",
    "slug": "matrix-symmetric",
    "title": "Symmetric",
    "category": "matrix",
    "categoryFolder": "2-D Matrix",
    "categoryDisplay": "2-D Matrix Operations",
    "originalFilename": "Symmetric.c",
    "originalPath": "FUNDAMENTALS OF C/2-D Matrix/Symmetric.c",
    "originalSource": "//Symmetric Matrix\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j,r,c,f=0;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    if(r==c)\r\n    {\r\n        int a[r][c];\r\n    printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n    //input\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n        {\r\n            printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n            scanf(\"%d\",&a[i][j]);\r\n        }\r\n    }\r\n    //output\r\n    printf(\"The Matrix is = \\n\");\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n            printf(\"%d \",a[i][j]);\r\n        printf(\"\\n\");\r\n    }\r\n    //Symmetric\r\n    for(i=0;i<c;i++)\r\n        for(j=0;j<r;j++)\r\n            if(a[i][j]!=a[j][i])\r\n            {\r\n                f=1;\r\n                break;\r\n            }\r\n    if(f==0)\r\n        printf(\"it is a Symmetric Matrix\");\r\n    else\r\n        printf(\"it is NOT a Symmetric Matrix\");\r\n    }\r\n    else\r\n        printf(\"1st & 2nd matrix's row and Column no are not same,so not possible\");\r\n}",
    "learningSource": "//Symmetric Matrix\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j,r,c,f=0;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    if(r==c)\r\n    {\r\n        int a[r][c];\r\n    printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n    //input\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n        {\r\n            printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n            scanf(\"%d\",&a[i][j]);\r\n        }\r\n    }\r\n    //output\r\n    printf(\"The Matrix is = \\n\");\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n            printf(\"%d \",a[i][j]);\r\n        printf(\"\\n\");\r\n    }\r\n    //Symmetric\r\n    for(i=0;i<c;i++)\r\n        for(j=0;j<r;j++)\r\n            if(a[i][j]!=a[j][i])\r\n            {\r\n                f=1;\r\n                break;\r\n            }\r\n    if(f==0)\r\n        printf(\"it is a Symmetric Matrix\");\r\n    else\r\n        printf(\"it is NOT a Symmetric Matrix\");\r\n    }\r\n    else\r\n        printf(\"1st & 2nd matrix's row and Column no are not same,so not possible\");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Symmetric from 2-D Matrix in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Symmetric.",
    "tags": [
      "c",
      "matrix",
      "symmetric"
    ],
    "difficulty": "medium",
    "defaultInput": "1 2 3 4",
    "presets": [
      {
        "label": "Default Input",
        "value": "1 2 3 4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "matrix",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-15",
    "slug": "matrix-transpose",
    "title": "Transpose",
    "category": "matrix",
    "categoryFolder": "2-D Matrix",
    "categoryDisplay": "2-D Matrix Operations",
    "originalFilename": "Transpose.c",
    "originalPath": "FUNDAMENTALS OF C/2-D Matrix/Transpose.c",
    "originalSource": "//Transpose of a Matrix\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j,r,c;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    int a[r][c];\r\n    printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n    //input\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n        {\r\n            printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n            scanf(\"%d\",&a[i][j]);\r\n        }\r\n    }\r\n    //output\r\n    printf(\"The Matrix is = \\n\");\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n            printf(\"%d \",a[i][j]);\r\n        printf(\"\\n\");\r\n    }\r\n    //Transpose\r\n    printf(\"The Transpose Matrix is = \\n\");\r\n    for(i=0;i<c;i++)\r\n    {\r\n        for(j=0;j<r;j++)\r\n            printf(\"%d \",a[j][i]);\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "//Transpose of a Matrix\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j,r,c;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    int a[r][c];\r\n    printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n    //input\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n        {\r\n            printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n            scanf(\"%d\",&a[i][j]);\r\n        }\r\n    }\r\n    //output\r\n    printf(\"The Matrix is = \\n\");\r\n    for(i=0;i<r;i++)\r\n    {\r\n        for(j=0;j<c;j++)\r\n            printf(\"%d \",a[i][j]);\r\n        printf(\"\\n\");\r\n    }\r\n    //Transpose\r\n    printf(\"The Transpose Matrix is = \\n\");\r\n    for(i=0;i<c;i++)\r\n    {\r\n        for(j=0;j<r;j++)\r\n            printf(\"%d \",a[j][i]);\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Transpose from 2-D Matrix in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Transpose.",
    "tags": [
      "c",
      "matrix",
      "transpose"
    ],
    "difficulty": "medium",
    "defaultInput": "1 2 3 4",
    "presets": [
      {
        "label": "Default Input",
        "value": "1 2 3 4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "matrix",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-16",
    "slug": "matrix-upper-left-triangle",
    "title": "Upper Left Triangle",
    "category": "matrix",
    "categoryFolder": "2-D Matrix",
    "categoryDisplay": "2-D Matrix Operations",
    "originalFilename": "Upper-Left-Triangle.c",
    "originalPath": "FUNDAMENTALS OF C/2-D Matrix/Upper-Left-Triangle.c",
    "originalSource": "//Upper Left triangle\r\n/*\r\n    1   2   3\r\n    4   5\r\n    7\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j,r,c;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    if(r==c)\r\n    {\r\n        int a[r][c];\r\n        printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n        //input\r\n        for(i=0;i<r;i++)\r\n        {\r\n            for(j=0;j<c;j++)\r\n            {\r\n                printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n                scanf(\"%d\",&a[i][j]);\r\n            }\r\n        }\r\n        //output\r\n        printf(\"The Matrix is = \\n\");\r\n        for(i=0;i<r;i++)\r\n        {\r\n                for(j=0;j<c;j++)\r\n                printf(\"%d \",a[i][j]);\r\n                printf(\"\\n\");\r\n        }\r\n        //Upper Left triangle\r\n        printf(\"Upper left Triangle\\n\");\r\n        for(i=0;i<r;i++)\r\n        {\r\n            for(j=0;j<c;j++)\r\n                ((i+j)<=r-1)?printf(\"%d \",a[i][j]):printf(\"  \");\r\n            printf(\"\\n\");\r\n        }\r\n    }\r\n    else\r\n        printf(\"1st & 2nd matrix's row and Column no are not same,so not possible\");\r\n}",
    "learningSource": "//Upper Left triangle\r\n/*\r\n    1   2   3\r\n    4   5\r\n    7\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j,r,c;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    if(r==c)\r\n    {\r\n        int a[r][c];\r\n        printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n        //input\r\n        for(i=0;i<r;i++)\r\n        {\r\n            for(j=0;j<c;j++)\r\n            {\r\n                printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n                scanf(\"%d\",&a[i][j]);\r\n            }\r\n        }\r\n        //output\r\n        printf(\"The Matrix is = \\n\");\r\n        for(i=0;i<r;i++)\r\n        {\r\n                for(j=0;j<c;j++)\r\n                printf(\"%d \",a[i][j]);\r\n                printf(\"\\n\");\r\n        }\r\n        //Upper Left triangle\r\n        printf(\"Upper left Triangle\\n\");\r\n        for(i=0;i<r;i++)\r\n        {\r\n            for(j=0;j<c;j++)\r\n                ((i+j)<=r-1)?printf(\"%d \",a[i][j]):printf(\"  \");\r\n            printf(\"\\n\");\r\n        }\r\n    }\r\n    else\r\n        printf(\"1st & 2nd matrix's row and Column no are not same,so not possible\");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Upper Left Triangle from 2-D Matrix in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Upper Left Triangle.",
    "tags": [
      "c",
      "matrix",
      "upper-left-triangle"
    ],
    "difficulty": "medium",
    "defaultInput": "1 2 3 4",
    "presets": [
      {
        "label": "Default Input",
        "value": "1 2 3 4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "matrix",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-17",
    "slug": "matrix-upper-right-triangle",
    "title": "Upper Right Triangle",
    "category": "matrix",
    "categoryFolder": "2-D Matrix",
    "categoryDisplay": "2-D Matrix Operations",
    "originalFilename": "Upper-Right-triangle.c",
    "originalPath": "FUNDAMENTALS OF C/2-D Matrix/Upper-Right-triangle.c",
    "originalSource": "//Upper right triangle\r\n/*\r\n    1   2   3\r\n        5   6\r\n            9\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j,r,c;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    if(r==c)\r\n    {\r\n        int a[r][c];\r\n        printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n        //input\r\n        for(i=0;i<r;i++)\r\n        {\r\n            for(j=0;j<c;j++)\r\n            {\r\n                printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n                scanf(\"%d\",&a[i][j]);\r\n            }\r\n        }\r\n        //output\r\n        printf(\"The Matrix is = \\n\");\r\n        for(i=0;i<r;i++)\r\n        {\r\n                for(j=0;j<c;j++)\r\n                printf(\"%d \",a[i][j]);\r\n                printf(\"\\n\");\r\n        }\r\n        //Upper Right triangle\r\n        printf(\"Upper Right Triangle\\n\");\r\n        for(i=0;i<r;i++)\r\n        {\r\n            for(j=0;j<c;j++)\r\n                (i<=j)?printf(\"%d \",a[i][j]):printf(\"  \");\r\n            printf(\"\\n\");\r\n        }\r\n    }\r\n    else\r\n        printf(\"1st & 2nd matrix's row and Column no are not same,so not possible\");\r\n}",
    "learningSource": "//Upper right triangle\r\n/*\r\n    1   2   3\r\n        5   6\r\n            9\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j,r,c;\r\n    printf(\"Enter the Row and Column No = \");\r\n    scanf(\"%d%d\",&r,&c);\r\n    if(r==c)\r\n    {\r\n        int a[r][c];\r\n        printf(\"Enter the Elements for %dX%d matrix= \\n\",r,c);\r\n        //input\r\n        for(i=0;i<r;i++)\r\n        {\r\n            for(j=0;j<c;j++)\r\n            {\r\n                printf(\"Enter the Element for (%d,%d) index = \",i,j);\r\n                scanf(\"%d\",&a[i][j]);\r\n            }\r\n        }\r\n        //output\r\n        printf(\"The Matrix is = \\n\");\r\n        for(i=0;i<r;i++)\r\n        {\r\n                for(j=0;j<c;j++)\r\n                printf(\"%d \",a[i][j]);\r\n                printf(\"\\n\");\r\n        }\r\n        //Upper Right triangle\r\n        printf(\"Upper Right Triangle\\n\");\r\n        for(i=0;i<r;i++)\r\n        {\r\n            for(j=0;j<c;j++)\r\n                (i<=j)?printf(\"%d \",a[i][j]):printf(\"  \");\r\n            printf(\"\\n\");\r\n        }\r\n    }\r\n    else\r\n        printf(\"1st & 2nd matrix's row and Column no are not same,so not possible\");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Upper Right Triangle from 2-D Matrix in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Upper Right Triangle.",
    "tags": [
      "c",
      "matrix",
      "upper-right-triangle"
    ],
    "difficulty": "medium",
    "defaultInput": "1 2 3 4",
    "presets": [
      {
        "label": "Default Input",
        "value": "1 2 3 4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "matrix",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-18",
    "slug": "basics-add",
    "title": "Add",
    "category": "basics",
    "categoryFolder": "Basics",
    "categoryDisplay": "Basics & Arithmetic",
    "originalFilename": "Add.c",
    "originalPath": "FUNDAMENTALS OF C/Basics/Add.c",
    "originalSource": "//WAP to add 2 no\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int a, b, sum;\r\n    printf(\"Enter 2 no: \");\r\n    scanf(\"%d%d\", &a, &b);\r\n    sum = a + b;\r\n    printf(\"Sum is: %d\", sum);\r\n}",
    "learningSource": "//WAP to add 2 no\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int a, b, sum;\r\n    printf(\"Enter 2 no: \");\r\n    scanf(\"%d%d\", &a, &b);\r\n    sum = a + b;\r\n    printf(\"Sum is: %d\", sum);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Add from Basics in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Add.",
    "tags": [
      "c",
      "basics",
      "add"
    ],
    "difficulty": "beginner",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "variables",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-19",
    "slug": "basics-add1",
    "title": "Add1",
    "category": "basics",
    "categoryFolder": "Basics",
    "categoryDisplay": "Basics & Arithmetic",
    "originalFilename": "Add1.c",
    "originalPath": "FUNDAMENTALS OF C/Basics/Add1.c",
    "originalSource": "//WAP to add 2 no without using 3rd variable\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int a, b;\r\n    printf(\"Enter 2 no: \");\r\n    scanf(\"%d%d\", &a, &b);\r\n    printf(\"%d + %d = %d\", a, b, a+b);\r\n}",
    "learningSource": "//WAP to add 2 no without using 3rd variable\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int a, b;\r\n    printf(\"Enter 2 no: \");\r\n    scanf(\"%d%d\", &a, &b);\r\n    printf(\"%d + %d = %d\", a, b, a+b);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Add1 from Basics in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Add1.",
    "tags": [
      "c",
      "basics",
      "add1"
    ],
    "difficulty": "beginner",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "variables",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-20",
    "slug": "basics-add-sub-mul-div-rem",
    "title": "Add Sub Mul Div Rem",
    "category": "basics",
    "categoryFolder": "Basics",
    "categoryDisplay": "Basics & Arithmetic",
    "originalFilename": "Add_Sub_Mul_Div_Rem.c",
    "originalPath": "FUNDAMENTALS OF C/Basics/Add_Sub_Mul_Div_Rem.c",
    "originalSource": "//WAP to add, Subtract, Multiply, Divide and Remainder of 2 no\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int a, b;\r\n    printf(\"Enter 2 no: \");\r\n    scanf(\"%d%d\", &a, &b);\r\n    printf(\"%d + %d = %d\\n\", a, b, a+b);\r\n    printf(\"%d - %d = %d\\n\", a, b, a-b);\r\n    printf(\"%d * %d = %d\\n\", a, b, a*b);\r\n    printf(\"%d / %d = %d\\n\", a, b, a/b);\r\n    printf(\"%d %% %d = %d\\n\", a, b, a%b);\r\n}",
    "learningSource": "//WAP to add, Subtract, Multiply, Divide and Remainder of 2 no\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int a, b;\r\n    printf(\"Enter 2 no: \");\r\n    scanf(\"%d%d\", &a, &b);\r\n    printf(\"%d + %d = %d\\n\", a, b, a+b);\r\n    printf(\"%d - %d = %d\\n\", a, b, a-b);\r\n    printf(\"%d * %d = %d\\n\", a, b, a*b);\r\n    printf(\"%d / %d = %d\\n\", a, b, a/b);\r\n    printf(\"%d %% %d = %d\\n\", a, b, a%b);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Add Sub Mul Div Rem from Basics in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Add Sub Mul Div Rem.",
    "tags": [
      "c",
      "basics",
      "add-sub-mul-div-rem"
    ],
    "difficulty": "beginner",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "variables",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-21",
    "slug": "basics-area-perimeter-of-circle",
    "title": "Area Perimeter Of Circle",
    "category": "basics",
    "categoryFolder": "Basics",
    "categoryDisplay": "Basics & Arithmetic",
    "originalFilename": "Area_Perimeter_of_Circle.c",
    "originalPath": "FUNDAMENTALS OF C/Basics/Area_Perimeter_of_Circle.c",
    "originalSource": "//WAP to calculate area and perimeter of circle\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    float r;\r\n    printf(\"Enter radius of circle: \");\r\n    scanf(\"%f\", &r);\r\n    printf(\"Area of circle is: %.2f\\n\", 3.14*r*r);\r\n    printf(\"Perimeter of circle is: %.2f\", 2*3.14*r);\r\n}\r\n",
    "learningSource": "//WAP to calculate area and perimeter of circle\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    float r;\r\n    printf(\"Enter radius of circle: \");\r\n    scanf(\"%f\", &r);\r\n    printf(\"Area of circle is: %.2f\\n\", 3.14*r*r);\r\n    printf(\"Perimeter of circle is: %.2f\", 2*3.14*r);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Area Perimeter Of Circle from Basics in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Area Perimeter Of Circle.",
    "tags": [
      "c",
      "basics",
      "area-perimeter-of-circle"
    ],
    "difficulty": "beginner",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "variables",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-22",
    "slug": "basics-area-perimeter-of-cube",
    "title": "Area Perimeter Of Cube",
    "category": "basics",
    "categoryFolder": "Basics",
    "categoryDisplay": "Basics & Arithmetic",
    "originalFilename": "Area_Perimeter_of_Cube.c",
    "originalPath": "FUNDAMENTALS OF C/Basics/Area_Perimeter_of_Cube.c",
    "originalSource": "//WAP to calculate area and perimeter of a Cube\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int s;\r\n    printf(\"Enter side of cube: \");\r\n    scanf(\"%d\", &s);\r\n    printf(\"Area of cube is: %d\\n\", 6*s*s);\r\n    printf(\"Perimeter of cube is: %d\", 12*s);\r\n}\r\n",
    "learningSource": "//WAP to calculate area and perimeter of a Cube\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int s;\r\n    printf(\"Enter side of cube: \");\r\n    scanf(\"%d\", &s);\r\n    printf(\"Area of cube is: %d\\n\", 6*s*s);\r\n    printf(\"Perimeter of cube is: %d\", 12*s);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Area Perimeter Of Cube from Basics in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Area Perimeter Of Cube.",
    "tags": [
      "c",
      "basics",
      "area-perimeter-of-cube"
    ],
    "difficulty": "beginner",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "variables",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-23",
    "slug": "basics-area-perimeter-of-cuboid",
    "title": "Area Perimeter Of Cuboid",
    "category": "basics",
    "categoryFolder": "Basics",
    "categoryDisplay": "Basics & Arithmetic",
    "originalFilename": "Area_Perimeter_of_Cuboid.c",
    "originalPath": "FUNDAMENTALS OF C/Basics/Area_Perimeter_of_Cuboid.c",
    "originalSource": "//WAP to calculate area and perimeter of Cuboid \r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int l, b, h;\r\n    printf(\"Enter length, breadth and height of cuboid: \");\r\n    scanf(\"%d%d%d\", &l, &b, &h);\r\n    printf(\"Area of cuboid is: %d\\n\", 2*(l*b + b*h + h*l));\r\n    printf(\"Perimeter of cuboid is: %d\", 4*(l+b+h));\r\n}",
    "learningSource": "//WAP to calculate area and perimeter of Cuboid \r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int l, b, h;\r\n    printf(\"Enter length, breadth and height of cuboid: \");\r\n    scanf(\"%d%d%d\", &l, &b, &h);\r\n    printf(\"Area of cuboid is: %d\\n\", 2*(l*b + b*h + h*l));\r\n    printf(\"Perimeter of cuboid is: %d\", 4*(l+b+h));\r\n\n    return 0;\n}",
    "description": "C educational implementation for Area Perimeter Of Cuboid from Basics in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Area Perimeter Of Cuboid.",
    "tags": [
      "c",
      "basics",
      "area-perimeter-of-cuboid"
    ],
    "difficulty": "beginner",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "variables",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-24",
    "slug": "basics-area-perimeter-of-rectangle",
    "title": "Area Perimeter Of Rectangle",
    "category": "basics",
    "categoryFolder": "Basics",
    "categoryDisplay": "Basics & Arithmetic",
    "originalFilename": "Area_Perimeter_of_Rectangle.c",
    "originalPath": "FUNDAMENTALS OF C/Basics/Area_Perimeter_of_Rectangle.c",
    "originalSource": "//WAP to calculate area and perimeter of rectangle\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int l, b;\r\n    printf(\"Enter length and breadth of rectangle: \");\r\n    scanf(\"%d%d\", &l, &b);\r\n    printf(\"Area of rectangle is: %d\\n\", l*b);\r\n    printf(\"Perimeter of rectangle is: %d\", 2*(l+b));\r\n}",
    "learningSource": "//WAP to calculate area and perimeter of rectangle\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int l, b;\r\n    printf(\"Enter length and breadth of rectangle: \");\r\n    scanf(\"%d%d\", &l, &b);\r\n    printf(\"Area of rectangle is: %d\\n\", l*b);\r\n    printf(\"Perimeter of rectangle is: %d\", 2*(l+b));\r\n\n    return 0;\n}",
    "description": "C educational implementation for Area Perimeter Of Rectangle from Basics in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Area Perimeter Of Rectangle.",
    "tags": [
      "c",
      "basics",
      "area-perimeter-of-rectangle"
    ],
    "difficulty": "beginner",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "variables",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-25",
    "slug": "basics-area-perimeter-of-square",
    "title": "Area Perimeter Of Square",
    "category": "basics",
    "categoryFolder": "Basics",
    "categoryDisplay": "Basics & Arithmetic",
    "originalFilename": "Area_Perimeter_of_Square.c",
    "originalPath": "FUNDAMENTALS OF C/Basics/Area_Perimeter_of_Square.c",
    "originalSource": "//WAP to calculate area and perimeter of Square\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int s;\r\n    printf(\"Enter side of square: \");\r\n    scanf(\"%d\", &s);\r\n    printf(\"Area of square is: %d\\n\", s*s);\r\n    printf(\"Perimeter of square is: %d\", 4*s);\r\n}",
    "learningSource": "//WAP to calculate area and perimeter of Square\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int s;\r\n    printf(\"Enter side of square: \");\r\n    scanf(\"%d\", &s);\r\n    printf(\"Area of square is: %d\\n\", s*s);\r\n    printf(\"Perimeter of square is: %d\", 4*s);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Area Perimeter Of Square from Basics in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Area Perimeter Of Square.",
    "tags": [
      "c",
      "basics",
      "area-perimeter-of-square"
    ],
    "difficulty": "beginner",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "variables",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-26",
    "slug": "basics-day-month-year",
    "title": "Day Month Year",
    "category": "basics",
    "categoryFolder": "Basics",
    "categoryDisplay": "Basics & Arithmetic",
    "originalFilename": "Day_Month_Year.c",
    "originalPath": "FUNDAMENTALS OF C/Basics/Day_Month_Year.c",
    "originalSource": "//WAP to make conversion of day to month and year\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int d, m, y;\r\n    printf(\"Enter number of days: \");\r\n    scanf(\"%d\", &d);\r\n    y = d / 365;\r\n    d = d % 365;\r\n    m = d / 30;\r\n    d = d % 30;\r\n    printf(\"%d days is equal to %d year, %d month and %d days\", d + m*30 + y*365, y, m, d);\r\n}",
    "learningSource": "//WAP to make conversion of day to month and year\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int d, m, y;\r\n    printf(\"Enter number of days: \");\r\n    scanf(\"%d\", &d);\r\n    y = d / 365;\r\n    d = d % 365;\r\n    m = d / 30;\r\n    d = d % 30;\r\n    printf(\"%d days is equal to %d year, %d month and %d days\", d + m*30 + y*365, y, m, d);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Day Month Year from Basics in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Day Month Year.",
    "tags": [
      "c",
      "basics",
      "day-month-year"
    ],
    "difficulty": "beginner",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "variables",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-27",
    "slug": "basics-day-to-month",
    "title": "Day To Month",
    "category": "basics",
    "categoryFolder": "Basics",
    "categoryDisplay": "Basics & Arithmetic",
    "originalFilename": "Day_to_Month.c",
    "originalPath": "FUNDAMENTALS OF C/Basics/Day_to_Month.c",
    "originalSource": "//WAP to Convert day to month\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int d,m;\r\n    printf(\"Enter number of days: \");\r\n    scanf(\"%d\", &d);\r\n    m = d / 30;\r\n    d= d % 30;\r\n    printf(\"%d days is equal to %d month and %d days\", d + m*30, m, d);\r\n}",
    "learningSource": "//WAP to Convert day to month\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int d,m;\r\n    printf(\"Enter number of days: \");\r\n    scanf(\"%d\", &d);\r\n    m = d / 30;\r\n    d= d % 30;\r\n    printf(\"%d days is equal to %d month and %d days\", d + m*30, m, d);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Day To Month from Basics in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Day To Month.",
    "tags": [
      "c",
      "basics",
      "day-to-month"
    ],
    "difficulty": "beginner",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "variables",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-28",
    "slug": "basics-day-to-year",
    "title": "Day To Year",
    "category": "basics",
    "categoryFolder": "Basics",
    "categoryDisplay": "Basics & Arithmetic",
    "originalFilename": "Day_to_Year.c",
    "originalPath": "FUNDAMENTALS OF C/Basics/Day_to_Year.c",
    "originalSource": "//WAP to convert day to year\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int d, y;\r\n    printf(\"Enter number of days: \");\r\n    scanf(\"%d\", &d);\r\n    y = d / 365;\r\n    d = d % 365;\r\n    printf(\"%d days is equal to %d year and %d days\", d + y*365, y, d);\r\n}\r\n",
    "learningSource": "//WAP to convert day to year\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int d, y;\r\n    printf(\"Enter number of days: \");\r\n    scanf(\"%d\", &d);\r\n    y = d / 365;\r\n    d = d % 365;\r\n    printf(\"%d days is equal to %d year and %d days\", d + y*365, y, d);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Day To Year from Basics in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Day To Year.",
    "tags": [
      "c",
      "basics",
      "day-to-year"
    ],
    "difficulty": "beginner",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "variables",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-29",
    "slug": "basics-print",
    "title": "Print",
    "category": "basics",
    "categoryFolder": "Basics",
    "categoryDisplay": "Basics & Arithmetic",
    "originalFilename": "Print.c",
    "originalPath": "FUNDAMENTALS OF C/Basics/Print.c",
    "originalSource": "//WAP to print any thing\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    printf(\"Hello World\");\r\n}",
    "learningSource": "//WAP to print any thing\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    printf(\"Hello World\");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Print from Basics in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Print.",
    "tags": [
      "c",
      "basics",
      "print"
    ],
    "difficulty": "beginner",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "variables",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-30",
    "slug": "basics-quotient-reminder",
    "title": "Quotient Reminder",
    "category": "basics",
    "categoryFolder": "Basics",
    "categoryDisplay": "Basics & Arithmetic",
    "originalFilename": "Quotient_Reminder.c",
    "originalPath": "FUNDAMENTALS OF C/Basics/Quotient_Reminder.c",
    "originalSource": "//WAP to find quotient and remainder of 2 no\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int a, b;\r\n    printf(\"Enter 2 no: \");\r\n    scanf(\"%d%d\", &a, &b);\r\n    printf(\"Quotient of %d and %d is: %d\\n\", a, b, a/b);\r\n    printf(\"Remainder of %d and %d is: %d\", a, b, a%b);\r\n}",
    "learningSource": "//WAP to find quotient and remainder of 2 no\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int a, b;\r\n    printf(\"Enter 2 no: \");\r\n    scanf(\"%d%d\", &a, &b);\r\n    printf(\"Quotient of %d and %d is: %d\\n\", a, b, a/b);\r\n    printf(\"Remainder of %d and %d is: %d\", a, b, a%b);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Quotient Reminder from Basics in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Quotient Reminder.",
    "tags": [
      "c",
      "basics",
      "quotient-reminder",
      "minimum",
      "smallest"
    ],
    "difficulty": "beginner",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "variables",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-31",
    "slug": "basics-simple-interest",
    "title": "Simple Interest",
    "category": "basics",
    "categoryFolder": "Basics",
    "categoryDisplay": "Basics & Arithmetic",
    "originalFilename": "Simple_Interest.c",
    "originalPath": "FUNDAMENTALS OF C/Basics/Simple_Interest.c",
    "originalSource": "//WAP to calculate Simple Interest\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    float p, r, t, si;\r\n    printf(\"Enter principal amount, rate of interest and time in years: \");\r\n    scanf(\"%f%f%f\", &p, &r, &t);\r\n    si = (p * r * t) / 100;\r\n    printf(\"Simple Interest is: %.2f\", si);\r\n}\r\n",
    "learningSource": "//WAP to calculate Simple Interest\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    float p, r, t, si;\r\n    printf(\"Enter principal amount, rate of interest and time in years: \");\r\n    scanf(\"%f%f%f\", &p, &r, &t);\r\n    si = (p * r * t) / 100;\r\n    printf(\"Simple Interest is: %.2f\", si);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Simple Interest from Basics in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Simple Interest.",
    "tags": [
      "c",
      "basics",
      "simple-interest"
    ],
    "difficulty": "beginner",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "variables",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-32",
    "slug": "character-array-string-problem-1-character-array",
    "title": "String Problem #1 (Character Array)",
    "category": "character-array",
    "categoryFolder": "Character array",
    "categoryDisplay": "Character Arrays & Strings",
    "originalFilename": "1st.c",
    "originalPath": "FUNDAMENTALS OF C/Character array/1st.c",
    "originalSource": "//alternate letter caps(Vul)\r\n/*\r\n   input --> boys don't cry are not they?\r\n   output-->BoYs DoN't CrY aRe NoT tHeY?\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    char x[20];\r\n    int i,j;\r\n    printf(\"Enter the Stirng = \");\r\n    gets(x);\r\n    printf(\"String = %s\\n\",x);\r\n    for(i=0;x[i]!='\\0';i++)\r\n    {\r\n        if(i%2==0)\r\n            if(x[i]>=97 && x[i]<=122)\r\n               x[i]=x[i]-32;\r\n        \r\n        if(x[i]==' ')\r\n               continue;\r\n        else if(i%2==0)\r\n        {\r\n            if(x[i]>=97 && x[i]<=122)\r\n               x[i]=x[i]-32;\r\n        } \r\n    }   \r\n    printf(\"%s\",x);    \r\n}\r\n/*\r\n        if(x[i]==' ')\r\n               continue;\r\n        else if(i%2==0)\r\n        {\r\n            if(x[i]>=97 && x[i]<=122)\r\n               x[i]=x[i]-32;\r\n        }*/",
    "learningSource": "//alternate letter caps(Vul)\r\n/*\r\n   input --> boys don't cry are not they?\r\n   output-->BoYs DoN't CrY aRe NoT tHeY?\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    char x[20];\r\n    int i,j;\r\n    printf(\"Enter the Stirng = \");\r\n    gets(x);\r\n    printf(\"String = %s\\n\",x);\r\n    for(i=0;x[i]!='\\0';i++)\r\n    {\r\n        if(i%2==0)\r\n            if(x[i]>=97 && x[i]<=122)\r\n               x[i]=x[i]-32;\r\n        \r\n        if(x[i]==' ')\r\n               continue;\r\n        else if(i%2==0)\r\n        {\r\n            if(x[i]>=97 && x[i]<=122)\r\n               x[i]=x[i]-32;\r\n        } \r\n    }   \r\n    printf(\"%s\",x);    \r\n}\r\n/*\r\n        if(x[i]==' ')\r\n               continue;\r\n        else if(i%2==0)\r\n        {\r\n            if(x[i]>=97 && x[i]<=122)\r\n               x[i]=x[i]-32;\r\n        }*/",
    "description": "C educational implementation for String Problem #1 (Character Array) from Character array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for String Problem #1 (Character Array).",
    "tags": [
      "c",
      "character-array",
      "string-problem-1-character-array"
    ],
    "difficulty": "easy",
    "defaultInput": "HELLO",
    "presets": [
      {
        "label": "Default Input",
        "value": "HELLO",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "string",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-33",
    "slug": "character-array-string-problem-2-character-array",
    "title": "String Problem #2 (Character Array)",
    "category": "character-array",
    "categoryFolder": "Character array",
    "categoryDisplay": "Character Arrays & Strings",
    "originalFilename": "2nd.c",
    "originalPath": "FUNDAMENTALS OF C/Character array/2nd.c",
    "originalSource": "//alternate letter caps(Vul)\r\n/*\r\n   input --> boys don't cry are not they?\r\n   output-->BoYs DoN't CrY aRe NoT tHeY?\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    char x[20];\r\n    int i,j;\r\n    printf(\"Enter the Stirng = \");\r\n    gets(x);\r\n    printf(\"String = %s\\n\",x);\r\n    for(i=0;x[i]!='\\0';i++)\r\n    {\r\n        if(x[i]==' ')\r\n        {\r\n            i=j;\r\n            break;\r\n        }\r\n    }\r\n    for(i=0;x[i]!='\\0';i++)\r\n    {\r\n        if(i==0)\r\n            if(x[i]>=97 && x[i]<=122)\r\n               x[i]=x[i]-32;\r\n        for(j=1;j<=i;j++)\r\n            if(j%2==0)\r\n                if(x[j]>=97 && x[j]<=122)\r\n                    x[j]=x[j]-32;\r\n        if(x[i]==' ')\r\n        {\r\n            for(j=i;j<=i;j++)\r\n            if(j%2==0)\r\n                if(x[j]>=97 && x[j]<=122)\r\n                    x[j]=x[j]-32;\r\n\r\n        }\r\n        \r\n    }    \r\n    printf(\"%s\",x);    \r\n}\r\n/*\r\n        if(x[i]==' ')\r\n          {\r\n             if(x[i-1]>=65 && x[i-1]<=90)\r\n               continue;\r\n          }\r\n        else if(i%2==0)\r\n        {\r\n            if(x[i]>=97 && x[i]<=122)\r\n               x[i]=x[i]-32;\r\n        }*/",
    "learningSource": "//alternate letter caps(Vul)\r\n/*\r\n   input --> boys don't cry are not they?\r\n   output-->BoYs DoN't CrY aRe NoT tHeY?\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    char x[20];\r\n    int i,j;\r\n    printf(\"Enter the Stirng = \");\r\n    gets(x);\r\n    printf(\"String = %s\\n\",x);\r\n    for(i=0;x[i]!='\\0';i++)\r\n    {\r\n        if(x[i]==' ')\r\n        {\r\n            i=j;\r\n            break;\r\n        }\r\n    }\r\n    for(i=0;x[i]!='\\0';i++)\r\n    {\r\n        if(i==0)\r\n            if(x[i]>=97 && x[i]<=122)\r\n               x[i]=x[i]-32;\r\n        for(j=1;j<=i;j++)\r\n            if(j%2==0)\r\n                if(x[j]>=97 && x[j]<=122)\r\n                    x[j]=x[j]-32;\r\n        if(x[i]==' ')\r\n        {\r\n            for(j=i;j<=i;j++)\r\n            if(j%2==0)\r\n                if(x[j]>=97 && x[j]<=122)\r\n                    x[j]=x[j]-32;\r\n\r\n        }\r\n        \r\n    }    \r\n    printf(\"%s\",x);    \r\n}\r\n/*\r\n        if(x[i]==' ')\r\n          {\r\n             if(x[i-1]>=65 && x[i-1]<=90)\r\n               continue;\r\n          }\r\n        else if(i%2==0)\r\n        {\r\n            if(x[i]>=97 && x[i]<=122)\r\n               x[i]=x[i]-32;\r\n        }*/",
    "description": "C educational implementation for String Problem #2 (Character Array) from Character array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for String Problem #2 (Character Array).",
    "tags": [
      "c",
      "character-array",
      "string-problem-2-character-array"
    ],
    "difficulty": "easy",
    "defaultInput": "HELLO",
    "presets": [
      {
        "label": "Default Input",
        "value": "HELLO",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "string",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-34",
    "slug": "character-array-string-problem-3-character-array",
    "title": "String Problem #3 (Character Array)",
    "category": "character-array",
    "categoryFolder": "Character array",
    "categoryDisplay": "Character Arrays & Strings",
    "originalFilename": "3rd.c",
    "originalPath": "FUNDAMENTALS OF C/Character array/3rd.c",
    "originalSource": "//alternate letter caps(Vul)\r\n/*\r\n   input --> boys don't cry are not they?\r\n   output-->BoYs DoN't CrY aRe NoT tHeY?\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    char x[20];\r\n    int i,j,len=0;\r\n    printf(\"Enter the String = \");\r\n    gets(x);\r\n    printf(\"String = %s\\n\",x);\r\n    printf(\"String will be = \\n\");\r\n    for(i=0;x[i]!='\\0';i++)\r\n    {\r\n        if(x[i]==' ')\r\n         {\r\n            printf(\"%c\",x[i]);\r\n            len=i+1;\r\n            continue;\r\n         }\r\n        if(len%2==1)\r\n            //if(x[len]>=97 && x[len]<=122)\r\n                printf(\"%c\",x[len]-32); \r\n        else\r\n                printf(\"%c\",x[len]);\r\n        len++;\r\n    }\r\n  \r\n    printf(\"\\n%s\",x);    \r\n}\r\n/*\r\n        if(x[i]==' ')\r\n          {\r\n             if(x[i-1]>=65 && x[i-1]<=90)\r\n               continue;\r\n          }\r\n        else if(i%2==0)\r\n        {\r\n            if(x[i]>=97 && x[i]<=122)\r\n               x[i]=x[i]-32;\r\n        }*/",
    "learningSource": "//alternate letter caps(Vul)\r\n/*\r\n   input --> boys don't cry are not they?\r\n   output-->BoYs DoN't CrY aRe NoT tHeY?\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    char x[20];\r\n    int i,j,len=0;\r\n    printf(\"Enter the String = \");\r\n    gets(x);\r\n    printf(\"String = %s\\n\",x);\r\n    printf(\"String will be = \\n\");\r\n    for(i=0;x[i]!='\\0';i++)\r\n    {\r\n        if(x[i]==' ')\r\n         {\r\n            printf(\"%c\",x[i]);\r\n            len=i+1;\r\n            continue;\r\n         }\r\n        if(len%2==1)\r\n            //if(x[len]>=97 && x[len]<=122)\r\n                printf(\"%c\",x[len]-32); \r\n        else\r\n                printf(\"%c\",x[len]);\r\n        len++;\r\n    }\r\n  \r\n    printf(\"\\n%s\",x);    \r\n}\r\n/*\r\n        if(x[i]==' ')\r\n          {\r\n             if(x[i-1]>=65 && x[i-1]<=90)\r\n               continue;\r\n          }\r\n        else if(i%2==0)\r\n        {\r\n            if(x[i]>=97 && x[i]<=122)\r\n               x[i]=x[i]-32;\r\n        }*/",
    "description": "C educational implementation for String Problem #3 (Character Array) from Character array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for String Problem #3 (Character Array).",
    "tags": [
      "c",
      "character-array",
      "string-problem-3-character-array"
    ],
    "difficulty": "easy",
    "defaultInput": "HELLO",
    "presets": [
      {
        "label": "Default Input",
        "value": "HELLO",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "string",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-35",
    "slug": "character-array-acromatic1",
    "title": "Acromatic1",
    "category": "character-array",
    "categoryFolder": "Character array",
    "categoryDisplay": "Character Arrays & Strings",
    "originalFilename": "Acromatic1.c",
    "originalPath": "FUNDAMENTALS OF C/Character array/Acromatic1.c",
    "originalSource": "/*WAP to print acromatic string\r\nInput--> Rupanjan Dutta\r\nOutput-->R. Dutta\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    char x[100];\r\n    int i,len=0;\r\n    printf(\"Enter the String = \");\r\n    gets(x);\r\n    printf(\"The Acromatic String is = %c.\",(x[0]>=65 && x[0]<=90)?x[0]:x[0]-32);\r\n    for(i=1;x[i]!='\\0';i++)\r\n        if(x[i]==' ')\r\n        {\r\n            printf(\" %c\",(x[i+1]>=65 && x[i+1]<=90)?x[i+1]:x[i+1]-32);\r\n            break;\r\n        }\r\n    for(i=i+2;x[i]!='\\0';i++)\r\n        printf(\"%c\",(x[i]>='a' && x[i]<='z')?x[i]:x[i]+32);\r\n}\r\n",
    "learningSource": "/*WAP to print acromatic string\r\nInput--> Rupanjan Dutta\r\nOutput-->R. Dutta\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    char x[100];\r\n    int i,len=0;\r\n    printf(\"Enter the String = \");\r\n    gets(x);\r\n    printf(\"The Acromatic String is = %c.\",(x[0]>=65 && x[0]<=90)?x[0]:x[0]-32);\r\n    for(i=1;x[i]!='\\0';i++)\r\n        if(x[i]==' ')\r\n        {\r\n            printf(\" %c\",(x[i+1]>=65 && x[i+1]<=90)?x[i+1]:x[i+1]-32);\r\n            break;\r\n        }\r\n    for(i=i+2;x[i]!='\\0';i++)\r\n        printf(\"%c\",(x[i]>='a' && x[i]<='z')?x[i]:x[i]+32);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Acromatic1 from Character array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Acromatic1.",
    "tags": [
      "c",
      "character-array",
      "acromatic1"
    ],
    "difficulty": "easy",
    "defaultInput": "HELLO",
    "presets": [
      {
        "label": "Default Input",
        "value": "HELLO",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "string",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-36",
    "slug": "character-array-acromatic2",
    "title": "Acromatic2",
    "category": "character-array",
    "categoryFolder": "Character array",
    "categoryDisplay": "Character Arrays & Strings",
    "originalFilename": "Acromatic2.c",
    "originalPath": "FUNDAMENTALS OF C/Character array/Acromatic2.c",
    "originalSource": "/*WAP to print acromatic string\r\nInput--> Rupanjan Kumar Dutta\r\nOutput-->R.K. Dutta\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    char x[100];\r\n    int i,len=0,k=0,sp=0;\r\n    printf(\"Enter the String = \");\r\n    gets(x);\r\n    for(i=0;x[i]!='\\0';i++)\r\n        if(x[i]==' ')\r\n            sp++;\r\n    printf(\"The Acromatic String is = %c\",(x[0]>=65 && x[0]<=90)?x[0]:x[0]-32);\r\n    for(i=0;x[i]!='\\0';i++)\r\n          if(x[i]==' ')\r\n            {\r\n                printf(\". %c\",(x[i+1]>=65 && x[i+1]<=90)?x[i+1]:x[i+1]-32);\r\n                k++;\r\n                if(k==1)\r\n                    continue;\r\n                 else\r\n                    break;\r\n            }\r\n    for(i=i+2;x[i]!='\\0';i++)\r\n        printf(\"%c\",(x[i]>='a' && x[i]<='z')?x[i]:x[i]+32);\r\n}\r\n",
    "learningSource": "/*WAP to print acromatic string\r\nInput--> Rupanjan Kumar Dutta\r\nOutput-->R.K. Dutta\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    char x[100];\r\n    int i,len=0,k=0,sp=0;\r\n    printf(\"Enter the String = \");\r\n    gets(x);\r\n    for(i=0;x[i]!='\\0';i++)\r\n        if(x[i]==' ')\r\n            sp++;\r\n    printf(\"The Acromatic String is = %c\",(x[0]>=65 && x[0]<=90)?x[0]:x[0]-32);\r\n    for(i=0;x[i]!='\\0';i++)\r\n          if(x[i]==' ')\r\n            {\r\n                printf(\". %c\",(x[i+1]>=65 && x[i+1]<=90)?x[i+1]:x[i+1]-32);\r\n                k++;\r\n                if(k==1)\r\n                    continue;\r\n                 else\r\n                    break;\r\n            }\r\n    for(i=i+2;x[i]!='\\0';i++)\r\n        printf(\"%c\",(x[i]>='a' && x[i]<='z')?x[i]:x[i]+32);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Acromatic2 from Character array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Acromatic2.",
    "tags": [
      "c",
      "character-array",
      "acromatic2"
    ],
    "difficulty": "easy",
    "defaultInput": "HELLO",
    "presets": [
      {
        "label": "Default Input",
        "value": "HELLO",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "string",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-37",
    "slug": "character-array-alternate-letter",
    "title": "Alternate Letter",
    "category": "character-array",
    "categoryFolder": "Character array",
    "categoryDisplay": "Character Arrays & Strings",
    "originalFilename": "alternate-letter.c",
    "originalPath": "FUNDAMENTALS OF C/Character array/alternate-letter.c",
    "originalSource": "#include<stdio.h>\r\nvoid main()\r\n{\r\n    char x[100];\r\n    int i;\r\n    printf(\"Enter the String = \");\r\n    gets(x);\r\n    printf(\"The Alternate letters are = \\n\");\r\n    for(i=0;x[i]!='\\0';i++)\r\n        if(i%2==1)\r\n            printf(\"%c\",x[i]);\r\n}\r\n",
    "learningSource": "#include<stdio.h>\r\nint main(void)\r\n{\r\n    char x[100];\r\n    int i;\r\n    printf(\"Enter the String = \");\r\n    gets(x);\r\n    printf(\"The Alternate letters are = \\n\");\r\n    for(i=0;x[i]!='\\0';i++)\r\n        if(i%2==1)\r\n            printf(\"%c\",x[i]);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Alternate Letter from Character array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Alternate Letter.",
    "tags": [
      "c",
      "character-array",
      "alternate-letter"
    ],
    "difficulty": "easy",
    "defaultInput": "HELLO",
    "presets": [
      {
        "label": "Default Input",
        "value": "HELLO",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "string",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-38",
    "slug": "character-array-compare",
    "title": "Compare",
    "category": "character-array",
    "categoryFolder": "Character array",
    "categoryDisplay": "Character Arrays & Strings",
    "originalFilename": "compare.c",
    "originalPath": "FUNDAMENTALS OF C/Character array/compare.c",
    "originalSource": "//WAP to compare 2 String\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    char a[20],b[20];\r\n    int i,f=0;\r\n    printf(\"Enter the 2 String = \");\r\n    gets(a);\r\n    gets(b);\r\n    for(i=0;a[i]!='\\0' || b[i]!='\\0';i++)\r\n        if(a[i]>=65 && a[i]<=90)\r\n            a[i]=a[i]+32;\r\n        if(b[i]>=65 && b[i]<=90)\r\n            b[i]=b[i]+32;\r\n    for(i=0;a[i]!='\\0' || b[i]!='\\0';i++)\r\n        if(a[i]!=b[i])\r\n        {\r\n            f=1;\r\n            break;\r\n        }\r\n    if(f==1)\r\n        printf(\"2 string are NOT Matched\");\r\n    else\r\n        printf(\"2 string are Matched\");\r\n}",
    "learningSource": "//WAP to compare 2 String\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    char a[20],b[20];\r\n    int i,f=0;\r\n    printf(\"Enter the 2 String = \");\r\n    gets(a);\r\n    gets(b);\r\n    for(i=0;a[i]!='\\0' || b[i]!='\\0';i++)\r\n        if(a[i]>=65 && a[i]<=90)\r\n            a[i]=a[i]+32;\r\n        if(b[i]>=65 && b[i]<=90)\r\n            b[i]=b[i]+32;\r\n    for(i=0;a[i]!='\\0' || b[i]!='\\0';i++)\r\n        if(a[i]!=b[i])\r\n        {\r\n            f=1;\r\n            break;\r\n        }\r\n    if(f==1)\r\n        printf(\"2 string are NOT Matched\");\r\n    else\r\n        printf(\"2 string are Matched\");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Compare from Character array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Compare.",
    "tags": [
      "c",
      "character-array",
      "compare"
    ],
    "difficulty": "easy",
    "defaultInput": "HELLO",
    "presets": [
      {
        "label": "Default Input",
        "value": "HELLO",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "string",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-39",
    "slug": "character-array-concatenate",
    "title": "Concatenate",
    "category": "character-array",
    "categoryFolder": "Character array",
    "categoryDisplay": "Character Arrays & Strings",
    "originalFilename": "concatenate.c",
    "originalPath": "FUNDAMENTALS OF C/Character array/concatenate.c",
    "originalSource": "//WAP to concatenate 2 string\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    char x[20],y[20],z[20];\r\n    int i;\r\n    printf(\"Enter the 2 String= \");\r\n    gets(x);\r\n    gets(y);\r\n    for(i=0;x[i]!='\\0';i++)\r\n        z[i]=x[i];\r\n    z[i++]=' ';\r\n    for(int j=0;y[i]!='\\0';j++,i++)\r\n        z[i]=y[j];\r\n    printf(\"The Concatenate String is = %s\",z);\r\n}",
    "learningSource": "//WAP to concatenate 2 string\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    char x[20],y[20],z[20];\r\n    int i;\r\n    printf(\"Enter the 2 String= \");\r\n    gets(x);\r\n    gets(y);\r\n    for(i=0;x[i]!='\\0';i++)\r\n        z[i]=x[i];\r\n    z[i++]=' ';\r\n    for(int j=0;y[i]!='\\0';j++,i++)\r\n        z[i]=y[j];\r\n    printf(\"The Concatenate String is = %s\",z);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Concatenate from Character array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Concatenate.",
    "tags": [
      "c",
      "character-array",
      "concatenate"
    ],
    "difficulty": "easy",
    "defaultInput": "HELLO",
    "presets": [
      {
        "label": "Default Input",
        "value": "HELLO",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "string",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-40",
    "slug": "character-array-copy",
    "title": "Copy",
    "category": "character-array",
    "categoryFolder": "Character array",
    "categoryDisplay": "Character Arrays & Strings",
    "originalFilename": "copy.c",
    "originalPath": "FUNDAMENTALS OF C/Character array/copy.c",
    "originalSource": "//WAP to copy string from to another\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    char a[20],x[20];\r\n    int i;\r\n    printf(\"Enter the String - \");\r\n    gets(a);\r\n    printf(\"The string is  = %s\\n\",a);\r\n    printf(\"Copied string will be = \");\r\n    for(i=0;a[i]!='\\0';i++)\r\n    {\r\n        x[i]=a[i];\r\n        printf(\"%c\",x[i]);\r\n    }\r\n    \r\n}",
    "learningSource": "//WAP to copy string from to another\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    char a[20],x[20];\r\n    int i;\r\n    printf(\"Enter the String - \");\r\n    gets(a);\r\n    printf(\"The string is  = %s\\n\",a);\r\n    printf(\"Copied string will be = \");\r\n    for(i=0;a[i]!='\\0';i++)\r\n    {\r\n        x[i]=a[i];\r\n        printf(\"%c\",x[i]);\r\n    }\r\n    \r\n\n    return 0;\n}",
    "description": "C educational implementation for Copy from Character array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Copy.",
    "tags": [
      "c",
      "character-array",
      "copy"
    ],
    "difficulty": "easy",
    "defaultInput": "HELLO",
    "presets": [
      {
        "label": "Default Input",
        "value": "HELLO",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "string",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-41",
    "slug": "character-array-count-vowel-space-consonant",
    "title": "Count Vowel Space Consonant",
    "category": "character-array",
    "categoryFolder": "Character array",
    "categoryDisplay": "Character Arrays & Strings",
    "originalFilename": "count-vowel-space-consonant.c",
    "originalPath": "FUNDAMENTALS OF C/Character array/count-vowel-space-consonant.c",
    "originalSource": "#include<stdio.h>\r\nvoid main()\r\n{\r\n    char x[100];\r\n    int i, sp = 0, vo = 0, co = 0;\r\n    printf(\"Enter the String = \");\r\n    gets(x);\r\n    printf(\"Entered String = %s\\n\", x);\r\n    for(i = 0; x[i] != '\\0'; i++) \r\n        if(x[i] >= 'A' && x[i] <= 'Z')\r\n            x[i] = x[i] + 32;\r\n    for(i = 0; x[i] != '\\0'; i++)\r\n        (x[i] == ' ')?sp++:(x[i] == 'a' || x[i] == 'e' || x[i] == 'i' || x[i] == 'o' || x[i] == 'u') ?vo++: co++;\r\n    printf(\"Number of Vowels = %d\\nNumber of Spaces = %d\\nNumber of Consonants = %d\\n\", vo, sp, co);\r\n}\r\n",
    "learningSource": "#include<stdio.h>\r\nint main(void)\r\n{\r\n    char x[100];\r\n    int i, sp = 0, vo = 0, co = 0;\r\n    printf(\"Enter the String = \");\r\n    gets(x);\r\n    printf(\"Entered String = %s\\n\", x);\r\n    for(i = 0; x[i] != '\\0'; i++) \r\n        if(x[i] >= 'A' && x[i] <= 'Z')\r\n            x[i] = x[i] + 32;\r\n    for(i = 0; x[i] != '\\0'; i++)\r\n        (x[i] == ' ')?sp++:(x[i] == 'a' || x[i] == 'e' || x[i] == 'i' || x[i] == 'o' || x[i] == 'u') ?vo++: co++;\r\n    printf(\"Number of Vowels = %d\\nNumber of Spaces = %d\\nNumber of Consonants = %d\\n\", vo, sp, co);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Count Vowel Space Consonant from Character array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Count Vowel Space Consonant.",
    "tags": [
      "c",
      "character-array",
      "count-vowel-space-consonant"
    ],
    "difficulty": "easy",
    "defaultInput": "HELLO",
    "presets": [
      {
        "label": "Default Input",
        "value": "HELLO",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "string",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-42",
    "slug": "character-array-even-index",
    "title": "Even Index",
    "category": "character-array",
    "categoryFolder": "Character array",
    "categoryDisplay": "Character Arrays & Strings",
    "originalFilename": "even-index.c",
    "originalPath": "FUNDAMENTALS OF C/Character array/even-index.c",
    "originalSource": "/*WAP to print the even index\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    char x[100];\r\n    int i,len=0,k=0,sp=0;\r\n    printf(\"Enter the String = \");\r\n    gets(x);\r\n    printf(\"The output will be = \");\r\n    for(i=0;x[i]!='\\0';i++)\r\n        if(i%2==0)\r\n            printf(\"%c\",x[i]);\r\n}",
    "learningSource": "/*WAP to print the even index\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    char x[100];\r\n    int i,len=0,k=0,sp=0;\r\n    printf(\"Enter the String = \");\r\n    gets(x);\r\n    printf(\"The output will be = \");\r\n    for(i=0;x[i]!='\\0';i++)\r\n        if(i%2==0)\r\n            printf(\"%c\",x[i]);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Even Index from Character array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Even Index.",
    "tags": [
      "c",
      "character-array",
      "even-index"
    ],
    "difficulty": "easy",
    "defaultInput": "HELLO",
    "presets": [
      {
        "label": "Default Input",
        "value": "HELLO",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "string",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-43",
    "slug": "character-array-except-1st-last",
    "title": "Except 1st &Last",
    "category": "character-array",
    "categoryFolder": "Character array",
    "categoryDisplay": "Character Arrays & Strings",
    "originalFilename": "except-1st-&last.c",
    "originalPath": "FUNDAMENTALS OF C/Character array/except-1st-&last.c",
    "originalSource": "#include<stdio.h>\r\nvoid main()\r\n{\r\n    char x[100];\r\n    int i,len=0;\r\n    printf(\"Enter the String = \");\r\n    gets(x);\r\n    for(i=0;x[i]!='\\0';i++)\r\n        len++;\r\n    printf(\"The New String is = \\n\");\r\n    for(i=0;x[i]!='\\0';i++)\r\n        if(i!=len-1 && i!=0)\r\n            printf(\"%c\",x[i]);\r\n}\r\n",
    "learningSource": "#include<stdio.h>\r\nint main(void)\r\n{\r\n    char x[100];\r\n    int i,len=0;\r\n    printf(\"Enter the String = \");\r\n    gets(x);\r\n    for(i=0;x[i]!='\\0';i++)\r\n        len++;\r\n    printf(\"The New String is = \\n\");\r\n    for(i=0;x[i]!='\\0';i++)\r\n        if(i!=len-1 && i!=0)\r\n            printf(\"%c\",x[i]);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Except 1st &Last from Character array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Except 1st &Last.",
    "tags": [
      "c",
      "character-array",
      "except-1st-last"
    ],
    "difficulty": "easy",
    "defaultInput": "HELLO",
    "presets": [
      {
        "label": "Default Input",
        "value": "HELLO",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "string",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-44",
    "slug": "character-array-length-without-space",
    "title": "Length Without Space",
    "category": "character-array",
    "categoryFolder": "Character array",
    "categoryDisplay": "Character Arrays & Strings",
    "originalFilename": "length-without-space.c",
    "originalPath": "FUNDAMENTALS OF C/Character array/length-without-space.c",
    "originalSource": "//WAP to calculate the length of the string\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    char x[20];\r\n    int i,c=0;\r\n    printf(\"Enter the String = \");\r\n    gets(x);\r\n    for(i=0;x[i]!='\\0';i++)\r\n        if(x[i]!=' ')\r\n            c++;\r\n        //printf(\"%c\",x[i]);\r\n    printf(\"The length of the STRING is = %d\\nThe String is = %s\",c,x);\r\n}",
    "learningSource": "//WAP to calculate the length of the string\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    char x[20];\r\n    int i,c=0;\r\n    printf(\"Enter the String = \");\r\n    gets(x);\r\n    for(i=0;x[i]!='\\0';i++)\r\n        if(x[i]!=' ')\r\n            c++;\r\n        //printf(\"%c\",x[i]);\r\n    printf(\"The length of the STRING is = %d\\nThe String is = %s\",c,x);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Length Without Space from Character array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Length Without Space.",
    "tags": [
      "c",
      "character-array",
      "length-without-space"
    ],
    "difficulty": "easy",
    "defaultInput": "HELLO",
    "presets": [
      {
        "label": "Default Input",
        "value": "HELLO",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "string",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-45",
    "slug": "character-array-length",
    "title": "Length",
    "category": "character-array",
    "categoryFolder": "Character array",
    "categoryDisplay": "Character Arrays & Strings",
    "originalFilename": "length.c",
    "originalPath": "FUNDAMENTALS OF C/Character array/length.c",
    "originalSource": "//WAP to calculate the length of the string\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    char x[20];\r\n    int i;\r\n    printf(\"Enter the String = \");\r\n    gets(x);\r\n    for(i=0;x[i]!='\\0';i++)\r\n        printf(\"%c\",x[i]);\r\n    printf(\"The length of the STRING is = %d\",i);\r\n}",
    "learningSource": "//WAP to calculate the length of the string\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    char x[20];\r\n    int i;\r\n    printf(\"Enter the String = \");\r\n    gets(x);\r\n    for(i=0;x[i]!='\\0';i++)\r\n        printf(\"%c\",x[i]);\r\n    printf(\"The length of the STRING is = %d\",i);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Length from Character array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Length.",
    "tags": [
      "c",
      "character-array",
      "length"
    ],
    "difficulty": "easy",
    "defaultInput": "HELLO",
    "presets": [
      {
        "label": "Default Input",
        "value": "HELLO",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "string",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-46",
    "slug": "character-array-odd-index",
    "title": "Odd Index",
    "category": "character-array",
    "categoryFolder": "Character array",
    "categoryDisplay": "Character Arrays & Strings",
    "originalFilename": "odd-index.c",
    "originalPath": "FUNDAMENTALS OF C/Character array/odd-index.c",
    "originalSource": "/*WAP to print the even index\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    char x[100];\r\n    int i,len=0,k=0,sp=0;\r\n    printf(\"Enter the String = \");\r\n    gets(x);\r\n    printf(\"The output will be = \");\r\n    for(i=0;x[i]!='\\0';i++)\r\n        if(i%2==1)\r\n            printf(\"%c\",x[i]);\r\n}",
    "learningSource": "/*WAP to print the even index\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    char x[100];\r\n    int i,len=0,k=0,sp=0;\r\n    printf(\"Enter the String = \");\r\n    gets(x);\r\n    printf(\"The output will be = \");\r\n    for(i=0;x[i]!='\\0';i++)\r\n        if(i%2==1)\r\n            printf(\"%c\",x[i]);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Odd Index from Character array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Odd Index.",
    "tags": [
      "c",
      "character-array",
      "odd-index"
    ],
    "difficulty": "easy",
    "defaultInput": "HELLO",
    "presets": [
      {
        "label": "Default Input",
        "value": "HELLO",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "string",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-47",
    "slug": "character-array-reverse",
    "title": "Reverse",
    "category": "character-array",
    "categoryFolder": "Character array",
    "categoryDisplay": "Character Arrays & Strings",
    "originalFilename": "reverse.c",
    "originalPath": "FUNDAMENTALS OF C/Character array/reverse.c",
    "originalSource": "//WAP to REVERSE the string\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    char x[20];\r\n    int i;\r\n    printf(\"Enter the String = \");\r\n    gets(x);\r\n    printf(\"The string is = \\n\");\r\n    for(i=0;x[i]!='\\0';i++)\r\n        printf(\"%c\",x[i]);\r\n    printf(\"\\nReverse of the STRING is  = \\n\");\r\n    for(i=i-1;i>=0;i--)\r\n        printf(\"%c\",x[i]);\r\n}",
    "learningSource": "//WAP to REVERSE the string\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    char x[20];\r\n    int i;\r\n    printf(\"Enter the String = \");\r\n    gets(x);\r\n    printf(\"The string is = \\n\");\r\n    for(i=0;x[i]!='\\0';i++)\r\n        printf(\"%c\",x[i]);\r\n    printf(\"\\nReverse of the STRING is  = \\n\");\r\n    for(i=i-1;i>=0;i--)\r\n        printf(\"%c\",x[i]);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Reverse from Character array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Reverse.",
    "tags": [
      "c",
      "character-array",
      "reverse",
      "invert",
      "backwards"
    ],
    "difficulty": "easy",
    "defaultInput": "HELLO",
    "presets": [
      {
        "label": "Default Input",
        "value": "HELLO",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "string",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-48",
    "slug": "character-array-take-input",
    "title": "Take Input",
    "category": "character-array",
    "categoryFolder": "Character array",
    "categoryDisplay": "Character Arrays & Strings",
    "originalFilename": "take-input.c",
    "originalPath": "FUNDAMENTALS OF C/Character array/take-input.c",
    "originalSource": "//WAP to to take input within a array & print\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    char x[20];\r\n    int i;\r\n    printf(\"Enter the String = \");\r\n    gets(x);\r\n    printf(\"The String is  = %s\",x);\r\n    puts(x);\r\n    for(i=0;x[i]!='\\0';i++)\r\n        printf(\"%c\",x[i]);\r\n}",
    "learningSource": "//WAP to to take input within a array & print\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    char x[20];\r\n    int i;\r\n    printf(\"Enter the String = \");\r\n    gets(x);\r\n    printf(\"The String is  = %s\",x);\r\n    puts(x);\r\n    for(i=0;x[i]!='\\0';i++)\r\n        printf(\"%c\",x[i]);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Take Input from Character array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Take Input.",
    "tags": [
      "c",
      "character-array",
      "take-input"
    ],
    "difficulty": "easy",
    "defaultInput": "HELLO",
    "presets": [
      {
        "label": "Default Input",
        "value": "HELLO",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "string",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-49",
    "slug": "character-array-vowel-consonant",
    "title": "Vowel Consonant",
    "category": "character-array",
    "categoryFolder": "Character array",
    "categoryDisplay": "Character Arrays & Strings",
    "originalFilename": "vowel-consonant.c",
    "originalPath": "FUNDAMENTALS OF C/Character array/vowel-consonant.c",
    "originalSource": "//WAP to concatenate 2 string\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    char x[20],v[20],c[20];\r\n    int i,j,k;\r\n    printf(\"Enter the String= \");\r\n    gets(x);\r\n    printf(\"Enter the String = %s\\n\",x);\r\n    for(i=0;x[i]!='\\0';i++)\r\n        if(x[i]>=65 && x[i]<=90)\r\n            x[i]=x[i]+32;\r\n    for(j=0,k=0,i=0;x[i]!='\\0';i++)\r\n        (x[i]=='a' || x[i]=='e' || x[i]=='i' || x[i]=='o' || x[i]=='u') ? (v[k++]=x[i]) : (c[j++]=x[i]);\r\n    v[k]='\\0';\r\n    c[j]='\\0';\r\n    printf(\"Vowel = %s\\nConsonant = %s\",v,c);\r\n}",
    "learningSource": "//WAP to concatenate 2 string\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    char x[20],v[20],c[20];\r\n    int i,j,k;\r\n    printf(\"Enter the String= \");\r\n    gets(x);\r\n    printf(\"Enter the String = %s\\n\",x);\r\n    for(i=0;x[i]!='\\0';i++)\r\n        if(x[i]>=65 && x[i]<=90)\r\n            x[i]=x[i]+32;\r\n    for(j=0,k=0,i=0;x[i]!='\\0';i++)\r\n        (x[i]=='a' || x[i]=='e' || x[i]=='i' || x[i]=='o' || x[i]=='u') ? (v[k++]=x[i]) : (c[j++]=x[i]);\r\n    v[k]='\\0';\r\n    c[j]='\\0';\r\n    printf(\"Vowel = %s\\nConsonant = %s\",v,c);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Vowel Consonant from Character array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Vowel Consonant.",
    "tags": [
      "c",
      "character-array",
      "vowel-consonant"
    ],
    "difficulty": "easy",
    "defaultInput": "HELLO",
    "presets": [
      {
        "label": "Default Input",
        "value": "HELLO",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "string",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-50",
    "slug": "file-handling-read-and-copy-content-append",
    "title": "Read And Copy Content APPEND",
    "category": "file-handling",
    "categoryFolder": "File handling",
    "categoryDisplay": "File Handling Streams",
    "originalFilename": "Read_and_Copy_Content_APPEND.c",
    "originalPath": "FUNDAMENTALS OF C/File handling/Read_and_Copy_Content_APPEND.c",
    "originalSource": "//file read & copy\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n FILE *fp,*fp1;\r\n char fna[20],fna1[20],ch;\r\n int c=0;\r\n printf(\"\\n enter Source file name = \");\r\n scanf(\"%s\",&fna);//gets(fna);\r\n printf(\"\\nEnter Target file to be copied =\");\r\n scanf(\"%s\",&fna1);\r\n fp=fopen(fna,\"r\");\r\n fp1=fopen(fna1,\"a\");//w\r\n if(fp==NULL)\r\n printf(\" not found \");\r\n else\r\n {\r\n  while(1)\r\n  {\r\n   ch=fgetc(fp);\r\n   if(ch!=EOF)\r\n   {\r\n    fputc(ch,fp1);\r\n    c++; \r\n//    printf(\"%d \",c);\r\n    printf(\"%c\",ch);\r\n    //sleep(100);\r\n  }\r\n   else\r\n   {\r\n   printf(\"\\nCopy Complete\");\r\n   break;\r\n   }\r\n  }\r\n}\r\nprintf(\"\\ncount = %d\",c);\r\nfclose(fp);\r\nfclose(fp1);\r\n}",
    "learningSource": "//file read & copy\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n FILE *fp,*fp1;\r\n char fna[20],fna1[20],ch;\r\n int c=0;\r\n printf(\"\\n enter Source file name = \");\r\n scanf(\"%s\",&fna);//gets(fna);\r\n printf(\"\\nEnter Target file to be copied =\");\r\n scanf(\"%s\",&fna1);\r\n fp=fopen(fna,\"r\");\r\n fp1=fopen(fna1,\"a\");//w\r\n if(fp==NULL)\r\n printf(\" not found \");\r\n else\r\n {\r\n  while(1)\r\n  {\r\n   ch=fgetc(fp);\r\n   if(ch!=EOF)\r\n   {\r\n    fputc(ch,fp1);\r\n    c++; \r\n//    printf(\"%d \",c);\r\n    printf(\"%c\",ch);\r\n    //sleep(100);\r\n  }\r\n   else\r\n   {\r\n   printf(\"\\nCopy Complete\");\r\n   break;\r\n   }\r\n  }\r\n}\r\nprintf(\"\\ncount = %d\",c);\r\nfclose(fp);\r\nfclose(fp1);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Read And Copy Content APPEND from File handling in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Read And Copy Content APPEND.",
    "tags": [
      "c",
      "file-handling",
      "read-and-copy-content-append"
    ],
    "difficulty": "easy",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "file",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-51",
    "slug": "file-handling-write",
    "title": "Write",
    "category": "file-handling",
    "categoryFolder": "File handling",
    "categoryDisplay": "File Handling Streams",
    "originalFilename": "Write.c",
    "originalPath": "FUNDAMENTALS OF C/File handling/Write.c",
    "originalSource": "//wap to create a file(write) & read the content from the created file\r\n#include<stdio.h>\r\n//#include<windows.h>\r\nvoid main()\r\n{\r\n  FILE *fp;\r\n  char fna[20],ch;\r\n   printf(\"Enter the file Name=\");\r\n   scanf(\"%s\",&fna);//fna=\"susmita.txt\"\r\n   fp=fopen(fna,\"w\");\r\n   if(fp==NULL)\r\n       printf(\"Not Found\");\r\n   else\r\n    {\r\n      printf(\"Enter the Content=\\n\");\r\n      while(1)\r\n        {\r\n          scanf(\"%c\",&ch);//ch='hello susmita # kal jail e jabi?'\r\n          if(ch=='#') \r\n                break;\r\n         else\r\n             fputc(ch,fp); //hi\r\n         }  \r\n    }\r\nfclose(fp);\r\nprintf(\"File reading\");\r\n//sleep(1);\r\nprintf(\"........\");\r\nfp=fopen(fna,\"r\");\r\n while(1)\r\n  {\r\n     ch=fgetc(fp);\r\n     if(ch==EOF)\r\n           break;  \r\n     //sleep(1);\r\n     printf(\"%c\",ch);\r\n  }    \r\nfclose(fp);\r\n}",
    "learningSource": "//wap to create a file(write) & read the content from the created file\r\n#include<stdio.h>\r\n//#include<windows.h>\r\nint main(void)\r\n{\r\n  FILE *fp;\r\n  char fna[20],ch;\r\n   printf(\"Enter the file Name=\");\r\n   scanf(\"%s\",&fna);//fna=\"susmita.txt\"\r\n   fp=fopen(fna,\"w\");\r\n   if(fp==NULL)\r\n       printf(\"Not Found\");\r\n   else\r\n    {\r\n      printf(\"Enter the Content=\\n\");\r\n      while(1)\r\n        {\r\n          scanf(\"%c\",&ch);//ch='hello susmita # kal jail e jabi?'\r\n          if(ch=='#') \r\n                break;\r\n         else\r\n             fputc(ch,fp); //hi\r\n         }  \r\n    }\r\nfclose(fp);\r\nprintf(\"File reading\");\r\n//sleep(1);\r\nprintf(\"........\");\r\nfp=fopen(fna,\"r\");\r\n while(1)\r\n  {\r\n     ch=fgetc(fp);\r\n     if(ch==EOF)\r\n           break;  \r\n     //sleep(1);\r\n     printf(\"%c\",ch);\r\n  }    \r\nfclose(fp);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Write from File handling in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Write.",
    "tags": [
      "c",
      "file-handling",
      "write"
    ],
    "difficulty": "easy",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "file",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-52",
    "slug": "if-else-age",
    "title": "Age",
    "category": "if-else",
    "categoryFolder": "If Else",
    "categoryDisplay": "Conditional Flow (If-Else)",
    "originalFilename": "age.c",
    "originalPath": "FUNDAMENTALS OF C/If Else/age.c",
    "originalSource": "//WAP to calculate age\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int yr;\r\n    printf(\"Enter the Age = \");\r\n    scanf(\"%d\",&yr);\r\n    if (yr<0)\r\n        printf(\"Please Enter a Valid Age\");\r\n    else\r\n    {\r\n        if (yr>0 && yr<=6)\r\n            printf(\"%d--> Infant\",yr);\r\n        else if(yr>6 && yr<=12)\r\n            printf(\"%d-->Child\",yr);\r\n        else if(yr>12 && yr<=18)\r\n            printf(\"%d--> Teenager\",yr);\r\n        else if (yr>18 && yr<=35)\r\n            printf(\"%d--> Young Age\",yr);\r\n        else if(yr>35 && yr<=60)\r\n            printf(\"%d--> Middle Aged\",yr);\r\n        else if(yr>60 && yr<=100)\r\n            printf(\"%d-->Old Aged\",yr);\r\n        else\r\n            printf(\"%d-->Nice Try Diddy\",yr);\r\n    }\r\n}",
    "learningSource": "//WAP to calculate age\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int yr;\r\n    printf(\"Enter the Age = \");\r\n    scanf(\"%d\",&yr);\r\n    if (yr<0)\r\n        printf(\"Please Enter a Valid Age\");\r\n    else\r\n    {\r\n        if (yr>0 && yr<=6)\r\n            printf(\"%d--> Infant\",yr);\r\n        else if(yr>6 && yr<=12)\r\n            printf(\"%d-->Child\",yr);\r\n        else if(yr>12 && yr<=18)\r\n            printf(\"%d--> Teenager\",yr);\r\n        else if (yr>18 && yr<=35)\r\n            printf(\"%d--> Young Age\",yr);\r\n        else if(yr>35 && yr<=60)\r\n            printf(\"%d--> Middle Aged\",yr);\r\n        else if(yr>60 && yr<=100)\r\n            printf(\"%d-->Old Aged\",yr);\r\n        else\r\n            printf(\"%d-->Nice Try Diddy\",yr);\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Age from If Else in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Age.",
    "tags": [
      "c",
      "if-else",
      "age"
    ],
    "difficulty": "easy",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "condition",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-53",
    "slug": "if-else-age-calculate",
    "title": "Age Calculate",
    "category": "if-else",
    "categoryFolder": "If Else",
    "categoryDisplay": "Conditional Flow (If-Else)",
    "originalFilename": "Age_Calculate.c",
    "originalPath": "FUNDAMENTALS OF C/If Else/Age_Calculate.c",
    "originalSource": "//WAP to check whether a year is Leap year or not\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int yr;\r\n    printf(\"Enter the Age = \");\r\n    scanf(\"%d\",&yr);\r\n    if (yr<0)\r\n        printf(\"Please Enter a Valid Age\");\r\n    else\r\n    {\r\n        if (yr>0 && yr<=6)\r\n            printf(\"%d--> Infant\",yr);\r\n        else if(yr>6 && yr<=12)\r\n            printf(\"%d-->Child\",yr);\r\n        else if(yr>12 && yr<=18)\r\n            printf(\"%d--> Teenager\",yr);\r\n        else if (yr>18 && yr<=35)\r\n            printf(\"%d--> Young Age\",yr);\r\n        else if(yr>35 && yr<=60)\r\n            printf(\"%d--> Middle Aged\",yr);\r\n        else if(yr>60 && yr<=100)\r\n            printf(\"%d-->Old Aged\",yr);\r\n        else\r\n            printf(\"%d-->Nice Try Diddy\",yr);\r\n    }\r\n}",
    "learningSource": "//WAP to check whether a year is Leap year or not\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int yr;\r\n    printf(\"Enter the Age = \");\r\n    scanf(\"%d\",&yr);\r\n    if (yr<0)\r\n        printf(\"Please Enter a Valid Age\");\r\n    else\r\n    {\r\n        if (yr>0 && yr<=6)\r\n            printf(\"%d--> Infant\",yr);\r\n        else if(yr>6 && yr<=12)\r\n            printf(\"%d-->Child\",yr);\r\n        else if(yr>12 && yr<=18)\r\n            printf(\"%d--> Teenager\",yr);\r\n        else if (yr>18 && yr<=35)\r\n            printf(\"%d--> Young Age\",yr);\r\n        else if(yr>35 && yr<=60)\r\n            printf(\"%d--> Middle Aged\",yr);\r\n        else if(yr>60 && yr<=100)\r\n            printf(\"%d-->Old Aged\",yr);\r\n        else\r\n            printf(\"%d-->Nice Try Diddy\",yr);\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Age Calculate from If Else in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Age Calculate.",
    "tags": [
      "c",
      "if-else",
      "age-calculate"
    ],
    "difficulty": "easy",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "condition",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-54",
    "slug": "if-else-autopolymorphic",
    "title": "Autopolymorphic",
    "category": "if-else",
    "categoryFolder": "If Else",
    "categoryDisplay": "Conditional Flow (If-Else)",
    "originalFilename": "autopolymorphic.c",
    "originalPath": "FUNDAMENTALS OF C/If Else/autopolymorphic.c",
    "originalSource": "//WAP to check whether a no is Autopolymorphic no or not\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int a;\r\n    printf(\"Enter the No = \");\r\n    scanf(\"%d\",&a);\r\n    if (a==0)\r\n        printf(\"%d is a Neutral no\",a);\r\n    else if ((a*a)%10==a || (a*a)%100==a)\r\n        printf(\"%d is a Autopolymorphic No\",a);\r\n    else   \r\n        printf(\"%d is Not a Autopollymorphic No\",a);\r\n}",
    "learningSource": "//WAP to check whether a no is Autopolymorphic no or not\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int a;\r\n    printf(\"Enter the No = \");\r\n    scanf(\"%d\",&a);\r\n    if (a==0)\r\n        printf(\"%d is a Neutral no\",a);\r\n    else if ((a*a)%10==a || (a*a)%100==a)\r\n        printf(\"%d is a Autopolymorphic No\",a);\r\n    else   \r\n        printf(\"%d is Not a Autopollymorphic No\",a);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Autopolymorphic from If Else in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Autopolymorphic.",
    "tags": [
      "c",
      "if-else",
      "autopolymorphic",
      "scope",
      "lifetime",
      "memory"
    ],
    "difficulty": "easy",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "condition",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-55",
    "slug": "if-else-buzz",
    "title": "Buzz",
    "category": "if-else",
    "categoryFolder": "If Else",
    "categoryDisplay": "Conditional Flow (If-Else)",
    "originalFilename": "Buzz.c",
    "originalPath": "FUNDAMENTALS OF C/If Else/Buzz.c",
    "originalSource": "//WAP to check whether a no is Buzz no or not\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int a;\r\n    printf(\"Enter the No = \");\r\n    scanf(\"%d\",&a);\r\n    if (a==0)\r\n        printf(\"%d is a Neutral no\",a);\r\n    else if (a%10==7 && a%7==0)\r\n        printf(\"%d is a Buzz No\",a);\r\n    else    \r\n        printf(\"%d is NOt a Buzz No\",a);\r\n}",
    "learningSource": "//WAP to check whether a no is Buzz no or not\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int a;\r\n    printf(\"Enter the No = \");\r\n    scanf(\"%d\",&a);\r\n    if (a==0)\r\n        printf(\"%d is a Neutral no\",a);\r\n    else if (a%10==7 && a%7==0)\r\n        printf(\"%d is a Buzz No\",a);\r\n    else    \r\n        printf(\"%d is NOt a Buzz No\",a);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Buzz from If Else in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Buzz.",
    "tags": [
      "c",
      "if-else",
      "buzz"
    ],
    "difficulty": "easy",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "condition",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-56",
    "slug": "if-else-even-odd",
    "title": "Even Odd",
    "category": "if-else",
    "categoryFolder": "If Else",
    "categoryDisplay": "Conditional Flow (If-Else)",
    "originalFilename": "even_odd.c",
    "originalPath": "FUNDAMENTALS OF C/If Else/even_odd.c",
    "originalSource": "//WAP to check whether a no is Even or not\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int a;\r\n    printf(\"Enter the No = \");\r\n    scanf(\"%d\",&a);\r\n    if (a==0)\r\n        printf(\"%d is a Neutral no\",a);\r\n    else if (a%2==0)\r\n        printf(\"%d is a Even no\",a);\r\n    else    \r\n        printf(\"%d is a Odd no\",a);\r\n}",
    "learningSource": "//WAP to check whether a no is Even or not\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int a;\r\n    printf(\"Enter the No = \");\r\n    scanf(\"%d\",&a);\r\n    if (a==0)\r\n        printf(\"%d is a Neutral no\",a);\r\n    else if (a%2==0)\r\n        printf(\"%d is a Even no\",a);\r\n    else    \r\n        printf(\"%d is a Odd no\",a);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Even Odd from If Else in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Even Odd.",
    "tags": [
      "c",
      "if-else",
      "even-odd"
    ],
    "difficulty": "easy",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "condition",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-57",
    "slug": "if-else-greater-between-2-number",
    "title": "Greater Between 2 Number",
    "category": "if-else",
    "categoryFolder": "If Else",
    "categoryDisplay": "Conditional Flow (If-Else)",
    "originalFilename": "greater_bw_2_no.c",
    "originalPath": "FUNDAMENTALS OF C/If Else/greater_bw_2_no.c",
    "originalSource": "//WAP to greater b/w 2 no\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int a,b;\r\n    printf(\"Enter the 2 No = \");\r\n    scanf(\"%d%d\",&a,&b);\r\n    if (a==b)\r\n        printf(\"Both are Equal\");\r\n    else if (a>b)\r\n        printf(\"%d is greater than %d\",a,b);\r\n    else\r\n        printf(\"%d is greater than %d\",b,a);\r\n}",
    "learningSource": "//WAP to greater b/w 2 no\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int a,b;\r\n    printf(\"Enter the 2 No = \");\r\n    scanf(\"%d%d\",&a,&b);\r\n    if (a==b)\r\n        printf(\"Both are Equal\");\r\n    else if (a>b)\r\n        printf(\"%d is greater than %d\",a,b);\r\n    else\r\n        printf(\"%d is greater than %d\",b,a);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Greater Between 2 Number from If Else in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Greater Between 2 Number.",
    "tags": [
      "c",
      "if-else",
      "greater-between-2-number"
    ],
    "difficulty": "easy",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "condition",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-58",
    "slug": "if-else-greatest-between-3-number",
    "title": "Greatest Between 3 Number",
    "category": "if-else",
    "categoryFolder": "If Else",
    "categoryDisplay": "Conditional Flow (If-Else)",
    "originalFilename": "greatest_bw_3_no.c",
    "originalPath": "FUNDAMENTALS OF C/If Else/greatest_bw_3_no.c",
    "originalSource": "//WAP to greatest_bw_3_no\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int a,b,c;\r\n    printf(\"Enter the 3 No = \");\r\n    scanf(\"%d%d%d\",&a,&b,&c);\r\n    if (a>b && b==c)\r\n        printf(\"1st no %d is Greatest than Both 2nd and 3rd no\",a);\r\n    else if (a>b && a>c)\r\n        printf(\"1st no %d is Greatest than %d and %d\",a,b,c);\r\n    else if (b>a && a==c)\r\n        printf(\"2nd no %d is Greatest than Both 1st and 3rd no\",b);\r\n    else if (b>a && b>c)\r\n        printf(\"2nd no %d is Greatest than %d and %d\",b,a,c);\r\n    else if (c>a && a==b)\r\n        printf(\"3rd no %d is Greatest than Both 1st and 2nd no\",c);\r\n    else if (c>a && c>b)\r\n        printf(\"3rd no %d is Greatest than %d and %d\",c,a,b);\r\n    //\r\n    if (a<b && b==c)\r\n        printf(\"1st no %d is Smallest than Both 2nd and 3rd no\",a);\r\n    else if (a<b && a<c)\r\n        printf(\"1st no %d is Smallest than %d and %d\",a,b,c);\r\n    else if (b<a && a==c)\r\n        printf(\"2nd no %d is Smallest than Both 1st and 3rd no\",b);\r\n    else if (b<a && b<c)\r\n        printf(\"2nd no %d is Smallest than %d and %d\",b,a,c);\r\n    else if (c<a && a==b)\r\n        printf(\"3rd no %d is Smallest than Both 1st and 2nd no\",c);\r\n    else if (c<a && c<b)\r\n        printf(\"3rd no %d is Smallest than %d and %d\",c,a,b);\r\n    else\r\n        printf(\"3 no are Equal\");\r\n}",
    "learningSource": "//WAP to greatest_bw_3_no\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int a,b,c;\r\n    printf(\"Enter the 3 No = \");\r\n    scanf(\"%d%d%d\",&a,&b,&c);\r\n    if (a>b && b==c)\r\n        printf(\"1st no %d is Greatest than Both 2nd and 3rd no\",a);\r\n    else if (a>b && a>c)\r\n        printf(\"1st no %d is Greatest than %d and %d\",a,b,c);\r\n    else if (b>a && a==c)\r\n        printf(\"2nd no %d is Greatest than Both 1st and 3rd no\",b);\r\n    else if (b>a && b>c)\r\n        printf(\"2nd no %d is Greatest than %d and %d\",b,a,c);\r\n    else if (c>a && a==b)\r\n        printf(\"3rd no %d is Greatest than Both 1st and 2nd no\",c);\r\n    else if (c>a && c>b)\r\n        printf(\"3rd no %d is Greatest than %d and %d\",c,a,b);\r\n    //\r\n    if (a<b && b==c)\r\n        printf(\"1st no %d is Smallest than Both 2nd and 3rd no\",a);\r\n    else if (a<b && a<c)\r\n        printf(\"1st no %d is Smallest than %d and %d\",a,b,c);\r\n    else if (b<a && a==c)\r\n        printf(\"2nd no %d is Smallest than Both 1st and 3rd no\",b);\r\n    else if (b<a && b<c)\r\n        printf(\"2nd no %d is Smallest than %d and %d\",b,a,c);\r\n    else if (c<a && a==b)\r\n        printf(\"3rd no %d is Smallest than Both 1st and 2nd no\",c);\r\n    else if (c<a && c<b)\r\n        printf(\"3rd no %d is Smallest than %d and %d\",c,a,b);\r\n    else\r\n        printf(\"3 no are Equal\");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Greatest Between 3 Number from If Else in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Greatest Between 3 Number.",
    "tags": [
      "c",
      "if-else",
      "greatest-between-3-number"
    ],
    "difficulty": "easy",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "condition",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-59",
    "slug": "if-else-leap-year",
    "title": "Leap Year",
    "category": "if-else",
    "categoryFolder": "If Else",
    "categoryDisplay": "Conditional Flow (If-Else)",
    "originalFilename": "leap_yr.c",
    "originalPath": "FUNDAMENTALS OF C/If Else/leap_yr.c",
    "originalSource": "//WAP to check whether a year is Leap year or not\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int a;\r\n    printf(\"Enter the Year = \");\r\n    scanf(\"%d\",&a);\r\n    if ((a%400==0) || ((a%4==0) && (a%100!=0)))\r\n        printf(\"%d is a Leap Year\",a);\r\n    else\r\n        printf(\"%d is NOT a Leap Year\",a);\r\n}",
    "learningSource": "//WAP to check whether a year is Leap year or not\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int a;\r\n    printf(\"Enter the Year = \");\r\n    scanf(\"%d\",&a);\r\n    if ((a%400==0) || ((a%4==0) && (a%100!=0)))\r\n        printf(\"%d is a Leap Year\",a);\r\n    else\r\n        printf(\"%d is NOT a Leap Year\",a);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Leap Year from If Else in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Leap Year.",
    "tags": [
      "c",
      "if-else",
      "leap-year"
    ],
    "difficulty": "easy",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "condition",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-60",
    "slug": "if-else-phone-bill",
    "title": "Phone Bill",
    "category": "if-else",
    "categoryFolder": "If Else",
    "categoryDisplay": "Conditional Flow (If-Else)",
    "originalFilename": "ph_bill.c",
    "originalPath": "FUNDAMENTALS OF C/If Else/ph_bill.c",
    "originalSource": "//WAP to print the Phone Bill\r\n#include<stdio.h>\r\nvoid main()\r\n{ \r\n    int a,r;\r\n    printf(\"Enter the Unit = \");\r\n    scanf(\"%d\",&a);\r\n    if (a<=0)\r\n        printf(\"Please Enter a Valid Unit\");\r\n    else\r\n    {\r\n        if (a>0 && a<=100)\r\n            r=a*1.5;\r\n        else if (a>100 && a<=200)\r\n            r=(a-100)*3.5+150;\r\n        else if (a>200 && a<=400)\r\n            r=(a-200)*5.5+500;\r\n        else if (a>400 && a<=600)\r\n            r=(a-400)*7.5+1600;\r\n        else if(a>600 && a<=800)\r\n            r=(a-600)*10.5+3100;\r\n        else\r\n            r=(a-800)*12.5+5200;\r\n    }\r\n    printf(\"Unit = %d\\nBill Price = %dRs/-unit\",a,r);\r\n}",
    "learningSource": "//WAP to print the Phone Bill\r\n#include<stdio.h>\r\nint main(void)\r\n{ \r\n    int a,r;\r\n    printf(\"Enter the Unit = \");\r\n    scanf(\"%d\",&a);\r\n    if (a<=0)\r\n        printf(\"Please Enter a Valid Unit\");\r\n    else\r\n    {\r\n        if (a>0 && a<=100)\r\n            r=a*1.5;\r\n        else if (a>100 && a<=200)\r\n            r=(a-100)*3.5+150;\r\n        else if (a>200 && a<=400)\r\n            r=(a-200)*5.5+500;\r\n        else if (a>400 && a<=600)\r\n            r=(a-400)*7.5+1600;\r\n        else if(a>600 && a<=800)\r\n            r=(a-600)*10.5+3100;\r\n        else\r\n            r=(a-800)*12.5+5200;\r\n    }\r\n    printf(\"Unit = %d\\nBill Price = %dRs/-unit\",a,r);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Phone Bill from If Else in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Phone Bill.",
    "tags": [
      "c",
      "if-else",
      "phone-bill"
    ],
    "difficulty": "easy",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "condition",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-61",
    "slug": "if-else-positive-negattive",
    "title": "Positive Negattive",
    "category": "if-else",
    "categoryFolder": "If Else",
    "categoryDisplay": "Conditional Flow (If-Else)",
    "originalFilename": "positive_negattive.c",
    "originalPath": "FUNDAMENTALS OF C/If Else/positive_negattive.c",
    "originalSource": "//WAP to check whether a no is Positive or not\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int a;\r\n    printf(\"Enter the No = \");\r\n    scanf(\"%d\",&a);\r\n    if (a==0)\r\n        printf(\"%d is a Neutral no\",a);\r\n    else if(a>0)\r\n        printf(\"%d is a Positive No\",a);\r\n    else\r\n        printf(\"%d is a Negative no\",a);\r\n}",
    "learningSource": "//WAP to check whether a no is Positive or not\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int a;\r\n    printf(\"Enter the No = \");\r\n    scanf(\"%d\",&a);\r\n    if (a==0)\r\n        printf(\"%d is a Neutral no\",a);\r\n    else if(a>0)\r\n        printf(\"%d is a Positive No\",a);\r\n    else\r\n        printf(\"%d is a Negative no\",a);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Positive Negattive from If Else in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Positive Negattive.",
    "tags": [
      "c",
      "if-else",
      "positive-negattive"
    ],
    "difficulty": "easy",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "condition",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-62",
    "slug": "integer-array-2nd-maximum",
    "title": "2nd Maximum",
    "category": "integer-array",
    "categoryFolder": "Integer Array",
    "categoryDisplay": "1-D Integer Arrays",
    "originalFilename": "2nd_Max.c",
    "originalPath": "FUNDAMENTALS OF C/Integer Array/2nd_Max.c",
    "originalSource": "//2nd Max\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int max,a[10],i,secmax,k,n;\r\n    printf(\"Enter the Range= \");\r\n    scanf(\"%d\",&n);\r\n    printf(\"Enter the Elements = \");\r\n    for(i=0;i<n;i++)\r\n        scanf(\"%d\",&a[i]);\r\n    max=a[0];\r\n    for(i=1;i<n;i++)\r\n        if(max<a[i])\r\n        {\r\n            max=a[i];\r\n            k=i;\r\n        }\r\n    secmax=-1;\r\n    for(i=0;i<n;i++)\r\n        if(k!=i)\r\n            if(secmax<a[i])\r\n                secmax=a[i];\r\n    printf(\"The 2nd Max is = %d\",secmax);\r\n}",
    "learningSource": "//2nd Max\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int max,a[10],i,secmax,k,n;\r\n    printf(\"Enter the Range= \");\r\n    scanf(\"%d\",&n);\r\n    printf(\"Enter the Elements = \");\r\n    for(i=0;i<n;i++)\r\n        scanf(\"%d\",&a[i]);\r\n    max=a[0];\r\n    for(i=1;i<n;i++)\r\n        if(max<a[i])\r\n        {\r\n            max=a[i];\r\n            k=i;\r\n        }\r\n    secmax=-1;\r\n    for(i=0;i<n;i++)\r\n        if(k!=i)\r\n            if(secmax<a[i])\r\n                secmax=a[i];\r\n    printf(\"The 2nd Max is = %d\",secmax);\r\n\n    return 0;\n}",
    "description": "C educational implementation for 2nd Maximum from Integer Array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for 2nd Maximum.",
    "tags": [
      "c",
      "integer-array",
      "2nd-maximum",
      "maximum",
      "largest",
      "greatest"
    ],
    "difficulty": "easy",
    "defaultInput": "10 25 7 99 42",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 25 7 99 42",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "array",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-63",
    "slug": "integer-array-above-average",
    "title": "Above Average",
    "category": "integer-array",
    "categoryFolder": "Integer Array",
    "categoryDisplay": "1-D Integer Arrays",
    "originalFilename": "above-average.c",
    "originalPath": "FUNDAMENTALS OF C/Integer Array/above-average.c",
    "originalSource": "//WAP to find out above average elements in an Int array and print\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int n,b,s=0;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&b);\r\n        a[i]=b;\r\n        s=s+a[i];\r\n    }\r\n    printf(\"The Array is - \");\r\n     for(int i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n    printf(\"\\nAbove Average of the Array is  = %f\",(float)s/(float)n);\r\n    printf(\"\\nAbove average element is/are - \");\r\n     for(int i=0;i<n;i++)\r\n    {\r\n        if (a[i] > s / n)\r\n            printf(\"%d \", a[i]);\r\n    }\r\n}",
    "learningSource": "//WAP to find out above average elements in an Int array and print\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int n,b,s=0;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&b);\r\n        a[i]=b;\r\n        s=s+a[i];\r\n    }\r\n    printf(\"The Array is - \");\r\n     for(int i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n    printf(\"\\nAbove Average of the Array is  = %f\",(float)s/(float)n);\r\n    printf(\"\\nAbove average element is/are - \");\r\n     for(int i=0;i<n;i++)\r\n    {\r\n        if (a[i] > s / n)\r\n            printf(\"%d \", a[i]);\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Above Average from Integer Array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Above Average.",
    "tags": [
      "c",
      "integer-array",
      "above-average",
      "mean",
      "average"
    ],
    "difficulty": "easy",
    "defaultInput": "10 25 7 99 42",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 25 7 99 42",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "array",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-64",
    "slug": "integer-array-average",
    "title": "Average",
    "category": "integer-array",
    "categoryFolder": "Integer Array",
    "categoryDisplay": "1-D Integer Arrays",
    "originalFilename": "average.c",
    "originalPath": "FUNDAMENTALS OF C/Integer Array/average.c",
    "originalSource": "//WAP to take input in a Int array and print\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int n,b,s=0;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&b);\r\n        a[i]=b;\r\n        s=s+a[i];\r\n    }\r\n    printf(\"The Array is - \");\r\n     for(int i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n    printf(\"\\naverage of the Array is  = %f\",(float)s/(float)n);\r\n}",
    "learningSource": "//WAP to take input in a Int array and print\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int n,b,s=0;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&b);\r\n        a[i]=b;\r\n        s=s+a[i];\r\n    }\r\n    printf(\"The Array is - \");\r\n     for(int i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n    printf(\"\\naverage of the Array is  = %f\",(float)s/(float)n);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Average from Integer Array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Average.",
    "tags": [
      "c",
      "integer-array",
      "average",
      "mean"
    ],
    "difficulty": "easy",
    "defaultInput": "10 25 7 99 42",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 25 7 99 42",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "array",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-65",
    "slug": "integer-array-below-average",
    "title": "Below Average",
    "category": "integer-array",
    "categoryFolder": "Integer Array",
    "categoryDisplay": "1-D Integer Arrays",
    "originalFilename": "below-average.c",
    "originalPath": "FUNDAMENTALS OF C/Integer Array/below-average.c",
    "originalSource": "//WAP to find out below average elements in an Int array and print\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int n,b,s=0;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&b);\r\n        a[i]=b;\r\n        s=s+a[i];\r\n    }\r\n    printf(\"The Array is - \");\r\n     for(int i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n    printf(\"\\nAbove Average of the Array is  = %f\",(float)s/(float)n);\r\n    printf(\"\\nBelow average element is/are - \");\r\n     for(int i=0;i<n;i++)\r\n    {\r\n        if (a[i] < s / n)\r\n            printf(\"%d \", a[i]);\r\n    }\r\n}",
    "learningSource": "//WAP to find out below average elements in an Int array and print\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int n,b,s=0;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&b);\r\n        a[i]=b;\r\n        s=s+a[i];\r\n    }\r\n    printf(\"The Array is - \");\r\n     for(int i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n    printf(\"\\nAbove Average of the Array is  = %f\",(float)s/(float)n);\r\n    printf(\"\\nBelow average element is/are - \");\r\n     for(int i=0;i<n;i++)\r\n    {\r\n        if (a[i] < s / n)\r\n            printf(\"%d \", a[i]);\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Below Average from Integer Array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Below Average.",
    "tags": [
      "c",
      "integer-array",
      "below-average",
      "mean",
      "average"
    ],
    "difficulty": "easy",
    "defaultInput": "10 25 7 99 42",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 25 7 99 42",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "array",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-66",
    "slug": "integer-array-even-element",
    "title": "Even Element",
    "category": "integer-array",
    "categoryFolder": "Integer Array",
    "categoryDisplay": "1-D Integer Arrays",
    "originalFilename": "even-element.c",
    "originalPath": "FUNDAMENTALS OF C/Integer Array/even-element.c",
    "originalSource": "//WAP to print the even elements in an Int array\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int n,b,i;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&b);\r\n        a[i]=b;\r\n    }\r\n    printf(\"The Array is - \");\r\n     for(i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n    printf(\"\\nEven elements in the Array are = \");\r\n    for(i=0;i<n;i++)\r\n    {\r\n        if(a[i]%2==0)\r\n            printf(\"%d \",a[i]);\r\n    }\r\n    //printf(\"\\nMaximum element in the Array is = %d\",max);\r\n}",
    "learningSource": "//WAP to print the even elements in an Int array\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int n,b,i;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&b);\r\n        a[i]=b;\r\n    }\r\n    printf(\"The Array is - \");\r\n     for(i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n    printf(\"\\nEven elements in the Array are = \");\r\n    for(i=0;i<n;i++)\r\n    {\r\n        if(a[i]%2==0)\r\n            printf(\"%d \",a[i]);\r\n    }\r\n    //printf(\"\\nMaximum element in the Array is = %d\",max);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Even Element from Integer Array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Even Element.",
    "tags": [
      "c",
      "integer-array",
      "even-element"
    ],
    "difficulty": "easy",
    "defaultInput": "10 25 7 99 42",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 25 7 99 42",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "array",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-67",
    "slug": "integer-array-even-index",
    "title": "Even Index",
    "category": "integer-array",
    "categoryFolder": "Integer Array",
    "categoryDisplay": "1-D Integer Arrays",
    "originalFilename": "even-index.c",
    "originalPath": "FUNDAMENTALS OF C/Integer Array/even-index.c",
    "originalSource": "//WAP to print the even index elements in an Int array\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int n,b,i;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&b);\r\n        a[i]=b;\r\n    }\r\n    printf(\"The Array is - \");\r\n     for(i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n    printf(\"\\nEven index element in the Array is = \");\r\n    for(i=0;i<n;i++)\r\n    {\r\n        if(i%2==0)\r\n            printf(\"%d \",a[i]);\r\n    }\r\n    //printf(\"\\nMaximum element in the Array is = %d\",max);\r\n}",
    "learningSource": "//WAP to print the even index elements in an Int array\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int n,b,i;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&b);\r\n        a[i]=b;\r\n    }\r\n    printf(\"The Array is - \");\r\n     for(i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n    printf(\"\\nEven index element in the Array is = \");\r\n    for(i=0;i<n;i++)\r\n    {\r\n        if(i%2==0)\r\n            printf(\"%d \",a[i]);\r\n    }\r\n    //printf(\"\\nMaximum element in the Array is = %d\",max);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Even Index from Integer Array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Even Index.",
    "tags": [
      "c",
      "integer-array",
      "even-index"
    ],
    "difficulty": "easy",
    "defaultInput": "10 25 7 99 42",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 25 7 99 42",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "array",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-68",
    "slug": "integer-array-how-many-times-element-present",
    "title": "How Many Times Element Present",
    "category": "integer-array",
    "categoryFolder": "Integer Array",
    "categoryDisplay": "1-D Integer Arrays",
    "originalFilename": "how-many-times-element-present.c",
    "originalPath": "FUNDAMENTALS OF C/Integer Array/how-many-times-element-present.c",
    "originalSource": "//WAP to count how many times an element is present in an array\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int n,count=0,b;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&a[i]);\r\n    }   \r\n    printf(\"Enter the element to count = \");\r\n    scanf(\"%d\",&b);\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        if(a[i]==b)\r\n            count++;\r\n    }\r\n    printf(\"The element %d is present %d times in the array.\",b,count);\r\n}",
    "learningSource": "//WAP to count how many times an element is present in an array\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int n,count=0,b;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&a[i]);\r\n    }   \r\n    printf(\"Enter the element to count = \");\r\n    scanf(\"%d\",&b);\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        if(a[i]==b)\r\n            count++;\r\n    }\r\n    printf(\"The element %d is present %d times in the array.\",b,count);\r\n\n    return 0;\n}",
    "description": "C educational implementation for How Many Times Element Present from Integer Array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for How Many Times Element Present.",
    "tags": [
      "c",
      "integer-array",
      "how-many-times-element-present"
    ],
    "difficulty": "easy",
    "defaultInput": "10 25 7 99 42",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 25 7 99 42",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "array",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-69",
    "slug": "integer-array-maximum",
    "title": "Maximum",
    "category": "integer-array",
    "categoryFolder": "Integer Array",
    "categoryDisplay": "1-D Integer Arrays",
    "originalFilename": "max.c",
    "originalPath": "FUNDAMENTALS OF C/Integer Array/max.c",
    "originalSource": "//WAP to find out the maximum element in an Int array and print\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int n,b,s=0,max=0;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&b);\r\n        a[i]=b;\r\n        s=s+a[i];\r\n    }\r\n    printf(\"The Array is - \");\r\n     for(int i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n    max = a[0];\r\n    for(int i=1;i<n;i++)\r\n    {\r\n        if (a[i] > max)\r\n         max = a[i];\r\n    }\r\n    printf(\"\\nMaximum element in the Array is = %d\",max);\r\n}",
    "learningSource": "//WAP to find out the maximum element in an Int array and print\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int n,b,s=0,max=0;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&b);\r\n        a[i]=b;\r\n        s=s+a[i];\r\n    }\r\n    printf(\"The Array is - \");\r\n     for(int i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n    max = a[0];\r\n    for(int i=1;i<n;i++)\r\n    {\r\n        if (a[i] > max)\r\n         max = a[i];\r\n    }\r\n    printf(\"\\nMaximum element in the Array is = %d\",max);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Maximum from Integer Array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Maximum.",
    "tags": [
      "c",
      "integer-array",
      "maximum",
      "largest",
      "greatest"
    ],
    "difficulty": "easy",
    "defaultInput": "10 25 7 99 42",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 25 7 99 42",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "array",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-70",
    "slug": "integer-array-middle-element",
    "title": "Middle Element",
    "category": "integer-array",
    "categoryFolder": "Integer Array",
    "categoryDisplay": "1-D Integer Arrays",
    "originalFilename": "middle-element.c",
    "originalPath": "FUNDAMENTALS OF C/Integer Array/middle-element.c",
    "originalSource": "//WAP to print the middle element(s) in an Int array\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int n,b,i;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&b);\r\n        a[i]=b;\r\n    }\r\n    printf(\"The Array is - \");\r\n     for(i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n    if(n%2==1)\r\n        printf(\"\\nMiddle element in the Array is = %d\",a[n/2]);\r\n    else\r\n        printf(\"\\nMiddle elements in the Array are = %d and %d\",a[(n/2)-1],a[n/2]);\r\n}",
    "learningSource": "//WAP to print the middle element(s) in an Int array\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int n,b,i;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&b);\r\n        a[i]=b;\r\n    }\r\n    printf(\"The Array is - \");\r\n     for(i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n    if(n%2==1)\r\n        printf(\"\\nMiddle element in the Array is = %d\",a[n/2]);\r\n    else\r\n        printf(\"\\nMiddle elements in the Array are = %d and %d\",a[(n/2)-1],a[n/2]);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Middle Element from Integer Array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Middle Element.",
    "tags": [
      "c",
      "integer-array",
      "middle-element"
    ],
    "difficulty": "easy",
    "defaultInput": "10 25 7 99 42",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 25 7 99 42",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "array",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-71",
    "slug": "integer-array-minimum",
    "title": "Minimum",
    "category": "integer-array",
    "categoryFolder": "Integer Array",
    "categoryDisplay": "1-D Integer Arrays",
    "originalFilename": "min.c",
    "originalPath": "FUNDAMENTALS OF C/Integer Array/min.c",
    "originalSource": "//WAP to find out the minimum element in an Int array and print\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int n,b,s=0,min=0;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&b);\r\n        a[i]=b;\r\n        s=s+a[i];\r\n    }\r\n    printf(\"The Array is - \");\r\n     for(int i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n    min = a[0];\r\n    for(int i=1;i<n;i++)\r\n    {\r\n        if (a[i] < min)\r\n         min = a[i];\r\n    }\r\n    printf(\"\\nMinimum element in the Array is = %d\",min);\r\n}",
    "learningSource": "//WAP to find out the minimum element in an Int array and print\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int n,b,s=0,min=0;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&b);\r\n        a[i]=b;\r\n        s=s+a[i];\r\n    }\r\n    printf(\"The Array is - \");\r\n     for(int i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n    min = a[0];\r\n    for(int i=1;i<n;i++)\r\n    {\r\n        if (a[i] < min)\r\n         min = a[i];\r\n    }\r\n    printf(\"\\nMinimum element in the Array is = %d\",min);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Minimum from Integer Array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Minimum.",
    "tags": [
      "c",
      "integer-array",
      "minimum",
      "smallest"
    ],
    "difficulty": "easy",
    "defaultInput": "10 25 7 99 42",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 25 7 99 42",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "array",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-72",
    "slug": "integer-array-odd-element",
    "title": "Odd Element",
    "category": "integer-array",
    "categoryFolder": "Integer Array",
    "categoryDisplay": "1-D Integer Arrays",
    "originalFilename": "odd-element.c",
    "originalPath": "FUNDAMENTALS OF C/Integer Array/odd-element.c",
    "originalSource": "//WAP to print the odd elements in an Int array\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int n,b,i;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&b);\r\n        a[i]=b;\r\n    }\r\n    printf(\"The Array is - \");\r\n     for(i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n    printf(\"\\nODD elements in the Array are = \");\r\n    for(i=0;i<n;i++)\r\n    {\r\n        if(a[i]%2==1)\r\n            printf(\"%d \",a[i]);\r\n    }\r\n    //printf(\"\\nMaximum element in the Array is = %d\",max);\r\n}",
    "learningSource": "//WAP to print the odd elements in an Int array\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int n,b,i;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&b);\r\n        a[i]=b;\r\n    }\r\n    printf(\"The Array is - \");\r\n     for(i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n    printf(\"\\nODD elements in the Array are = \");\r\n    for(i=0;i<n;i++)\r\n    {\r\n        if(a[i]%2==1)\r\n            printf(\"%d \",a[i]);\r\n    }\r\n    //printf(\"\\nMaximum element in the Array is = %d\",max);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Odd Element from Integer Array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Odd Element.",
    "tags": [
      "c",
      "integer-array",
      "odd-element"
    ],
    "difficulty": "easy",
    "defaultInput": "10 25 7 99 42",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 25 7 99 42",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "array",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-73",
    "slug": "integer-array-odd-index",
    "title": "Odd Index",
    "category": "integer-array",
    "categoryFolder": "Integer Array",
    "categoryDisplay": "1-D Integer Arrays",
    "originalFilename": "odd-index.c",
    "originalPath": "FUNDAMENTALS OF C/Integer Array/odd-index.c",
    "originalSource": "//WAP to print the odd index elements in an Int array\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int n,b,i;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&b);\r\n        a[i]=b;\r\n    }\r\n    printf(\"The Array is - \");\r\n     for(i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n    printf(\"\\nOdd index element in the Array is = \");\r\n    for(i=0;i<n;i++)\r\n    {\r\n        if(i%2==1)\r\n            printf(\"%d \",a[i]);\r\n    }\r\n    //printf(\"\\nMaximum element in the Array is = %d\",max);\r\n}",
    "learningSource": "//WAP to print the odd index elements in an Int array\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int n,b,i;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&b);\r\n        a[i]=b;\r\n    }\r\n    printf(\"The Array is - \");\r\n     for(i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n    printf(\"\\nOdd index element in the Array is = \");\r\n    for(i=0;i<n;i++)\r\n    {\r\n        if(i%2==1)\r\n            printf(\"%d \",a[i]);\r\n    }\r\n    //printf(\"\\nMaximum element in the Array is = %d\",max);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Odd Index from Integer Array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Odd Index.",
    "tags": [
      "c",
      "integer-array",
      "odd-index"
    ],
    "difficulty": "easy",
    "defaultInput": "10 25 7 99 42",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 25 7 99 42",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "array",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-74",
    "slug": "integer-array-reverse",
    "title": "Reverse",
    "category": "integer-array",
    "categoryFolder": "Integer Array",
    "categoryDisplay": "1-D Integer Arrays",
    "originalFilename": "reverse.c",
    "originalPath": "FUNDAMENTALS OF C/Integer Array/reverse.c",
    "originalSource": "// WAP to reverse an Int array\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int n;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&a[i]);\r\n    }\r\n    printf(\"The Array is - \");\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n    printf(\"\\nThe Reversed Array is - \");\r\n    for(int i=n-1;i>=0;i--)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n}",
    "learningSource": "// WAP to reverse an Int array\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int n;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&a[i]);\r\n    }\r\n    printf(\"The Array is - \");\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n    printf(\"\\nThe Reversed Array is - \");\r\n    for(int i=n-1;i>=0;i--)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Reverse from Integer Array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Reverse.",
    "tags": [
      "c",
      "integer-array",
      "reverse",
      "invert",
      "backwards"
    ],
    "difficulty": "easy",
    "defaultInput": "10 25 7 99 42",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 25 7 99 42",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "array",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-75",
    "slug": "integer-array-sum",
    "title": "Sum",
    "category": "integer-array",
    "categoryFolder": "Integer Array",
    "categoryDisplay": "1-D Integer Arrays",
    "originalFilename": "sum.c",
    "originalPath": "FUNDAMENTALS OF C/Integer Array/sum.c",
    "originalSource": "//WAP to print the sum of the elements in an Int array\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int n,b,s=0;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&b);\r\n        a[i]=b;\r\n    }\r\n    printf(\"The Array is - \");\r\n     for(int i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n        s=s+a[i];\r\n    }\r\n    printf(\"\\nSum = %d\",s);\r\n}",
    "learningSource": "//WAP to print the sum of the elements in an Int array\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int n,b,s=0;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&b);\r\n        a[i]=b;\r\n    }\r\n    printf(\"The Array is - \");\r\n     for(int i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n        s=s+a[i];\r\n    }\r\n    printf(\"\\nSum = %d\",s);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Sum from Integer Array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Sum.",
    "tags": [
      "c",
      "integer-array",
      "sum",
      "total",
      "addition",
      "add"
    ],
    "difficulty": "easy",
    "defaultInput": "10 25 7 99 42",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 25 7 99 42",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "array",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-76",
    "slug": "integer-array-take-input",
    "title": "Take Input",
    "category": "integer-array",
    "categoryFolder": "Integer Array",
    "categoryDisplay": "1-D Integer Arrays",
    "originalFilename": "take-input.c",
    "originalPath": "FUNDAMENTALS OF C/Integer Array/take-input.c",
    "originalSource": "//WAP to take input in a Int array and print\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int n,b;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&b);\r\n        a[i]=b;\r\n    }\r\n    printf(\"The Array is - \");\r\n     for(int i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n}",
    "learningSource": "//WAP to take input in a Int array and print\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int n,b;\r\n    printf(\"Enter the Range  =\");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    for(int i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the element in %d Index = \",i);\r\n        scanf(\"%d\",&b);\r\n        a[i]=b;\r\n    }\r\n    printf(\"The Array is - \");\r\n     for(int i=0;i<n;i++)\r\n    {\r\n        printf(\" %d \",a[i]);\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Take Input from Integer Array in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Take Input.",
    "tags": [
      "c",
      "integer-array",
      "take-input"
    ],
    "difficulty": "easy",
    "defaultInput": "10 25 7 99 42",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 25 7 99 42",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "array",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-77",
    "slug": "nested-for-loop-pattern-10-nested-loops",
    "title": "Pattern #10 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "10th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/10th.c",
    "originalSource": "/*\r\n    9\r\n    7 9\r\n    5 7 9\r\n    3 5 7 9\r\n    1 3 5 7 9\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j;\r\n    for(i=9;i>=1;i-=2)\r\n    {\r\n        for(j=i;j<=9;j+=2)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "/*\r\n    9\r\n    7 9\r\n    5 7 9\r\n    3 5 7 9\r\n    1 3 5 7 9\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j;\r\n    for(i=9;i>=1;i-=2)\r\n    {\r\n        for(j=i;j<=9;j+=2)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #10 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #10 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-10-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-78",
    "slug": "nested-for-loop-pattern-11-nested-loops",
    "title": "Pattern #11 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "11th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/11th.c",
    "originalSource": "/*\r\n    1\r\n    2 1 \r\n    3 2 1\r\n    4 3 2 1\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i++)\r\n    {\r\n        for(j=i;j>=1;j--)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "/*\r\n    1\r\n    2 1 \r\n    3 2 1\r\n    4 3 2 1\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i++)\r\n    {\r\n        for(j=i;j>=1;j--)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #11 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #11 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-11-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-79",
    "slug": "nested-for-loop-pattern-12-nested-loops",
    "title": "Pattern #12 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "12th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/12th.c",
    "originalSource": "/*\r\n    4\r\n    3 4\r\n    2 3 4\r\n    1 2 3 4\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j;\r\n    for(i=4;i>=1;i-=1)\r\n    {\r\n        for(j=i;j<=4;j+=1)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "/*\r\n    4\r\n    3 4\r\n    2 3 4\r\n    1 2 3 4\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j;\r\n    for(i=4;i>=1;i-=1)\r\n    {\r\n        for(j=i;j<=4;j+=1)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #12 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #12 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-12-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-80",
    "slug": "nested-for-loop-pattern-13-nested-loops",
    "title": "Pattern #13 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "13th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/13th.c",
    "originalSource": "/*\r\n    1\r\n    2 2\r\n    3 3 3\r\n    4 4 4 4\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i+=1)\r\n    {\r\n        for(j=1;j<=i;j+=1)\r\n        {\r\n            printf(\"%d \",i);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "/*\r\n    1\r\n    2 2\r\n    3 3 3\r\n    4 4 4 4\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i+=1)\r\n    {\r\n        for(j=1;j<=i;j+=1)\r\n        {\r\n            printf(\"%d \",i);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #13 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #13 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-13-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-81",
    "slug": "nested-for-loop-pattern-14-nested-loops",
    "title": "Pattern #14 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "14th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/14th.c",
    "originalSource": "/*\r\n   4\r\n   3 3\r\n   2 2 2 \r\n   1 1 1 1 \r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j;\r\n    for(i=4;i>=1;i-=1)\r\n    {\r\n        for(j=4;j>=i;j-=1)\r\n        {\r\n            printf(\"%d \",i);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "/*\r\n   4\r\n   3 3\r\n   2 2 2 \r\n   1 1 1 1 \r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j;\r\n    for(i=4;i>=1;i-=1)\r\n    {\r\n        for(j=4;j>=i;j-=1)\r\n        {\r\n            printf(\"%d \",i);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #14 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #14 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-14-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-82",
    "slug": "nested-for-loop-pattern-15-nested-loops",
    "title": "Pattern #15 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "15th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/15th.c",
    "originalSource": "/*\r\n     4 4 4 4\r\n     3 3 3\r\n     2 2 \r\n     1 \r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j;\r\n    for(i=4;i>=1;i-=1)\r\n    {\r\n        for(j=i;j>=1;j-=1)\r\n        {\r\n            printf(\"%d \",i);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "/*\r\n     4 4 4 4\r\n     3 3 3\r\n     2 2 \r\n     1 \r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j;\r\n    for(i=4;i>=1;i-=1)\r\n    {\r\n        for(j=i;j>=1;j-=1)\r\n        {\r\n            printf(\"%d \",i);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #15 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #15 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-15-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-83",
    "slug": "nested-for-loop-pattern-16-nested-loops",
    "title": "Pattern #16 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "16th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/16th.c",
    "originalSource": "/*\r\n   5\r\n   4 4\r\n   3 3 3\r\n   2 2 2 2\r\n   1 1 1 1 1\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j;\r\n    for(i=5;i>=1;i-=1)\r\n    {\r\n        for(j=i;j<=5;j+=1)\r\n        {\r\n            printf(\"%d \",i);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "/*\r\n   5\r\n   4 4\r\n   3 3 3\r\n   2 2 2 2\r\n   1 1 1 1 1\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j;\r\n    for(i=5;i>=1;i-=1)\r\n    {\r\n        for(j=i;j<=5;j+=1)\r\n        {\r\n            printf(\"%d \",i);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #16 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #16 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-16-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-84",
    "slug": "nested-for-loop-pattern-17-nested-loops",
    "title": "Pattern #17 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "17th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/17th.c",
    "originalSource": "/*\r\n   * * * *\r\n   * * *\r\n   * * \r\n   * \r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i+=1)\r\n    {\r\n        for(j=i;j<=4;j+=1)\r\n        {\r\n            printf(\"* \");\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "/*\r\n   * * * *\r\n   * * *\r\n   * * \r\n   * \r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i+=1)\r\n    {\r\n        for(j=i;j<=4;j+=1)\r\n        {\r\n            printf(\"* \");\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #17 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #17 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-17-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-85",
    "slug": "nested-for-loop-pattern-18-nested-loops",
    "title": "Pattern #18 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "18th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/18th.c",
    "originalSource": "/*\r\n    *\r\n    * *\r\n    * * *\r\n    * * * *\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i+=1)\r\n    {\r\n        for(j=1;j<=i;j+=1)\r\n        {\r\n            printf(\"* \");\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "/*\r\n    *\r\n    * *\r\n    * * *\r\n    * * * *\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i+=1)\r\n    {\r\n        for(j=1;j<=i;j+=1)\r\n        {\r\n            printf(\"* \");\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #18 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #18 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-18-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-86",
    "slug": "nested-for-loop-pattern-19-nested-loops",
    "title": "Pattern #19 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "19th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/19th.c",
    "originalSource": "/*\r\n    = * * * \r\n    * = * *\r\n    * * = *\r\n    * * * =\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i+=1)\r\n    {\r\n        for(j=1;j<=4;j+=1)\r\n            (i==j)?printf(\"= \"):printf(\"* \");\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "/*\r\n    = * * * \r\n    * = * *\r\n    * * = *\r\n    * * * =\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i+=1)\r\n    {\r\n        for(j=1;j<=4;j+=1)\r\n            (i==j)?printf(\"= \"):printf(\"* \");\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #19 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #19 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-19-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-87",
    "slug": "nested-for-loop-pattern-1-nested-loops",
    "title": "Pattern #1 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "1st.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/1st.c",
    "originalSource": "/*\r\n      |1 2 3 4/\r\n      |2 3 4 /\r\n      |3 4  /  \r\n      |4   /\r\n\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i++)\r\n    {\r\n        for(j=i;j<=4;j++)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "/*\r\n      |1 2 3 4/\r\n      |2 3 4 /\r\n      |3 4  /  \r\n      |4   /\r\n\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i++)\r\n    {\r\n        for(j=i;j<=4;j++)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #1 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #1 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-1-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-88",
    "slug": "nested-for-loop-pattern-20-nested-loops",
    "title": "Pattern #20 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "20th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/20th.c",
    "originalSource": "/*\r\n    - - - * \r\n    - - * *\r\n    - * * *\r\n    * * * *\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i+=1)\r\n    {\r\n        for(j=1;j<=4;j+=1)\r\n            (i+j<=4)?printf(\"- \"):printf(\"* \");\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "/*\r\n    - - - * \r\n    - - * *\r\n    - * * *\r\n    * * * *\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i+=1)\r\n    {\r\n        for(j=1;j<=4;j+=1)\r\n            (i+j<=4)?printf(\"- \"):printf(\"* \");\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #20 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #20 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-20-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-89",
    "slug": "nested-for-loop-pattern-21-nested-loops",
    "title": "Pattern #21 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "21th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/21th.c",
    "originalSource": "/*\r\n    * * * *\r\n    - * * * \r\n    - - * *\r\n    - - - * \r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j,a;\r\n    printf(\"Enter the range = \");\r\n    scanf(\"%d\",&a);\r\n    for(i=1;i<=a;i+=1)\r\n    {\r\n        for(j=1;j<=a;j+=1)\r\n            (i>j || i==(j+1))?printf(\"- \"):printf(\"* \");\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "/*\r\n    * * * *\r\n    - * * * \r\n    - - * *\r\n    - - - * \r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j,a;\r\n    printf(\"Enter the range = \");\r\n    scanf(\"%d\",&a);\r\n    for(i=1;i<=a;i+=1)\r\n    {\r\n        for(j=1;j<=a;j+=1)\r\n            (i>j || i==(j+1))?printf(\"- \"):printf(\"* \");\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #21 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #21 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-21-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-90",
    "slug": "nested-for-loop-pattern-22-nested-loops",
    "title": "Pattern #22 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "22th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/22th.c",
    "originalSource": "/*\r\n    - - - * \r\n    - - * *\r\n    - * * *\r\n    * * * *\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j,a;\r\n    printf(\"Enter the range = \");\r\n    scanf(\"%d\",&a);\r\n    for(i=1;i<=a;i+=1)\r\n    {\r\n        for(j=1;j<=a;j+=1)\r\n            (i+j<=a)?printf(\" \"):printf(\"* \");\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "/*\r\n    - - - * \r\n    - - * *\r\n    - * * *\r\n    * * * *\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j,a;\r\n    printf(\"Enter the range = \");\r\n    scanf(\"%d\",&a);\r\n    for(i=1;i<=a;i+=1)\r\n    {\r\n        for(j=1;j<=a;j+=1)\r\n            (i+j<=a)?printf(\" \"):printf(\"* \");\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #22 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #22 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-22-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-91",
    "slug": "nested-for-loop-pattern-23-nested-loops",
    "title": "Pattern #23 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "23th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/23th.c",
    "originalSource": "/*\r\n    * * * *\r\n     * * * \r\n      * *\r\n       * \r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j,a;\r\n    printf(\"Enter the range = \");\r\n    scanf(\"%d\",&a);\r\n    for(i=1;i<=a;i+=1)\r\n    {\r\n        for(j=1;j<=a;j+=1)\r\n            (i>j || i==(j+1))?printf(\" \"):printf(\"* \");\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "/*\r\n    * * * *\r\n     * * * \r\n      * *\r\n       * \r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j,a;\r\n    printf(\"Enter the range = \");\r\n    scanf(\"%d\",&a);\r\n    for(i=1;i<=a;i+=1)\r\n    {\r\n        for(j=1;j<=a;j+=1)\r\n            (i>j || i==(j+1))?printf(\" \"):printf(\"* \");\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #23 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #23 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-23-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-92",
    "slug": "nested-for-loop-pattern-24-nested-loops",
    "title": "Pattern #24 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "24th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/24th.c",
    "originalSource": "//question no 24\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n  int i,j;\r\n  for(i=1;i<=5;i++)\r\n  {\r\n    for(j=i;j>=1;j--)\r\n      printf(\"%d\",j%2);\r\n    printf(\"\\n\");\r\n  }\r\n}\r\n",
    "learningSource": "//question no 24\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n  int i,j;\r\n  for(i=1;i<=5;i++)\r\n  {\r\n    for(j=i;j>=1;j--)\r\n      printf(\"%d\",j%2);\r\n    printf(\"\\n\");\r\n  }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #24 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #24 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-24-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-93",
    "slug": "nested-for-loop-pattern-25-nested-loops",
    "title": "Pattern #25 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "25th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/25th.c",
    "originalSource": "///question no 25\r\n/*\r\n    0\r\n    1   1\r\n    0   0   0\r\n    1   1   1   1\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i++)\r\n    {\r\n        for(j=1;j<=i;j++)\r\n        {\r\n            printf(\"%d \",(i+1)%2);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "///question no 25\r\n/*\r\n    0\r\n    1   1\r\n    0   0   0\r\n    1   1   1   1\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i++)\r\n    {\r\n        for(j=1;j<=i;j++)\r\n        {\r\n            printf(\"%d \",(i+1)%2);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #25 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #25 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-25-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-94",
    "slug": "nested-for-loop-pattern-26-nested-loops",
    "title": "Pattern #26 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "26th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/26th.c",
    "originalSource": "///question no 26\r\n/*\r\n    1\r\n    1   0\r\n    1   0   1\r\n    1   0   1   0\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i++)\r\n    {\r\n        for(j=1;j<=i;j++)\r\n        {\r\n            printf(\"%d \",j%2);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "///question no 26\r\n/*\r\n    1\r\n    1   0\r\n    1   0   1\r\n    1   0   1   0\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i++)\r\n    {\r\n        for(j=1;j<=i;j++)\r\n        {\r\n            printf(\"%d \",j%2);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #26 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #26 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-26-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-95",
    "slug": "nested-for-loop-pattern-27-nested-loops",
    "title": "Pattern #27 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "27th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/27th.c",
    "originalSource": "///question no 27\r\n/*\r\n    1 \r\n    0 0 \r\n    1 1 1 \r\n    0 0 0 0 \r\n    1 1 1 1 1\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j;\r\n    for(i=1;i<=5;i++)\r\n    {\r\n        for(j=1;j<=i;j++)\r\n            printf(\"%d \",i%2);\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "///question no 27\r\n/*\r\n    1 \r\n    0 0 \r\n    1 1 1 \r\n    0 0 0 0 \r\n    1 1 1 1 1\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j;\r\n    for(i=1;i<=5;i++)\r\n    {\r\n        for(j=1;j<=i;j++)\r\n            printf(\"%d \",i%2);\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #27 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #27 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-27-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-96",
    "slug": "nested-for-loop-pattern-28-nested-loops",
    "title": "Pattern #28 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "28th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/28th.c",
    "originalSource": "/*\r\n      * \r\n     * *\r\n    * * *\r\n   * * * *\r\n    * * *\r\n     * *\r\n      *\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j,a;\r\n    printf(\"Enter the range = \");\r\n    scanf(\"%d\",&a);\r\n    if(a%2==0)\r\n        printf(\"Please enter a odd no\");\r\n    else\r\n    {\r\n    for(i=1;i<=a;i+=1)\r\n    {\r\n        for(int p=a/2,j=1;j<=(a/2)+1;j+=1)\r\n            (i<=p+1)?((i+j<=p+1)?printf(\" \"):printf(\"* \")):(i>p+1)?((i-(p+1)>=j)?printf(\" \"):printf(\"* \")):printf(\"\");\r\n        printf(\"\\n\");\r\n    }\r\n    }\r\n}\r\n//(i+j<=a || (i-((a/2))==j || i-((a/2))>j))?printf(\" \"):printf(\"* \");\r\n//((i>)i+j<=a || (i-p==j || i-p>j))?printf(\" \"):printf(\"* \");\r\n         //   (i+j<=a/2+1)?printf(\" \"):printf(\"* \");\r\n        ",
    "learningSource": "/*\r\n      * \r\n     * *\r\n    * * *\r\n   * * * *\r\n    * * *\r\n     * *\r\n      *\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j,a;\r\n    printf(\"Enter the range = \");\r\n    scanf(\"%d\",&a);\r\n    if(a%2==0)\r\n        printf(\"Please enter a odd no\");\r\n    else\r\n    {\r\n    for(i=1;i<=a;i+=1)\r\n    {\r\n        for(int p=a/2,j=1;j<=(a/2)+1;j+=1)\r\n            (i<=p+1)?((i+j<=p+1)?printf(\" \"):printf(\"* \")):(i>p+1)?((i-(p+1)>=j)?printf(\" \"):printf(\"* \")):printf(\"\");\r\n        printf(\"\\n\");\r\n    }\r\n    }\r\n}\r\n//(i+j<=a || (i-((a/2))==j || i-((a/2))>j))?printf(\" \"):printf(\"* \");\r\n//((i>)i+j<=a || (i-p==j || i-p>j))?printf(\" \"):printf(\"* \");\r\n         //   (i+j<=a/2+1)?printf(\" \"):printf(\"* \");\r\n        ",
    "description": "C educational implementation for Pattern #28 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #28 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-28-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-97",
    "slug": "nested-for-loop-pattern-29-nested-loops",
    "title": "Pattern #29 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "29th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/29th.c",
    "originalSource": "///question no 29\r\n/*\r\n1 \r\n1 2 3 \r\n1 2 3 4 5 \r\n1 2 3 4 5 6 7   \r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i++)\r\n    {\r\n        for(j=1;j<=(2*i)-1;j++)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "///question no 29\r\n/*\r\n1 \r\n1 2 3 \r\n1 2 3 4 5 \r\n1 2 3 4 5 6 7   \r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i++)\r\n    {\r\n        for(j=1;j<=(2*i)-1;j++)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #29 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #29 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-29-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-98",
    "slug": "nested-for-loop-pattern-2-nested-loops",
    "title": "Pattern #2 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "2nd.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/2nd.c",
    "originalSource": "/*\r\n    4 3 2 1\r\n    3 2 1\r\n    2 1\r\n    1\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j;\r\n    for(i=4;i>=1;i--)\r\n    {\r\n        for(j=i;j>=1;j--)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "/*\r\n    4 3 2 1\r\n    3 2 1\r\n    2 1\r\n    1\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j;\r\n    for(i=4;i>=1;i--)\r\n    {\r\n        for(j=i;j>=1;j--)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #2 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #2 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-2-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-99",
    "slug": "nested-for-loop-pattern-30-nested-loops",
    "title": "Pattern #30 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "30th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/30th.c",
    "originalSource": "///question no 30\r\n/*\r\n          1 \r\n       1  2  3 \r\n    1  2  3  4  5 \r\n 1  2  3  4  5  6  7 \r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j,sp;\r\n    for(i=1;i<=4;i++)\r\n    {\r\n        for(sp=3;sp>=i;sp--)\r\n            printf(\"   \");\r\n        for(j=1;j<=(2*i)-1;j++)\r\n            printf(\" %d \",j);\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "///question no 30\r\n/*\r\n          1 \r\n       1  2  3 \r\n    1  2  3  4  5 \r\n 1  2  3  4  5  6  7 \r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j,sp;\r\n    for(i=1;i<=4;i++)\r\n    {\r\n        for(sp=3;sp>=i;sp--)\r\n            printf(\"   \");\r\n        for(j=1;j<=(2*i)-1;j++)\r\n            printf(\" %d \",j);\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #30 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #30 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-30-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-100",
    "slug": "nested-for-loop-pattern-31-nested-loops",
    "title": "Pattern #31 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "31th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/31th.c",
    "originalSource": "///question no 31\r\n/*\r\n1 \r\n1 2 1 \r\n1 2 3 2 1 \r\n1 2 3 4 3 2 1 \r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j,k;\r\n    for(i=1;i<=4;i++)\r\n    {\r\n        for(j=1;j<=i;j++)\r\n            printf(\"%d \",j);\r\n        for(k=i-1;k>=1;k--)\r\n            printf(\"%d \",k);\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "///question no 31\r\n/*\r\n1 \r\n1 2 1 \r\n1 2 3 2 1 \r\n1 2 3 4 3 2 1 \r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j,k;\r\n    for(i=1;i<=4;i++)\r\n    {\r\n        for(j=1;j<=i;j++)\r\n            printf(\"%d \",j);\r\n        for(k=i-1;k>=1;k--)\r\n            printf(\"%d \",k);\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #31 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #31 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-31-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-101",
    "slug": "nested-for-loop-pattern-32-nested-loops",
    "title": "Pattern #32 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "32th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/32th.c",
    "originalSource": "///question no 32\r\n/*\r\n          1 \r\n       1  2  1 \r\n    1  2  3  2  1 \r\n 1  2  3  4  3  2  1 \r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j,sp;\r\n    for(i=1;i<=4;i++)\r\n    {\r\n        for(sp=3;sp>=i;sp--)\r\n            printf(\"   \");\r\n        for(j=1;j<=i;j++)\r\n            printf(\" %d \",j);\r\n        for(j=i-1;j>=1;j--)\r\n            printf(\" %d \",j);\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "///question no 32\r\n/*\r\n          1 \r\n       1  2  1 \r\n    1  2  3  2  1 \r\n 1  2  3  4  3  2  1 \r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j,sp;\r\n    for(i=1;i<=4;i++)\r\n    {\r\n        for(sp=3;sp>=i;sp--)\r\n            printf(\"   \");\r\n        for(j=1;j<=i;j++)\r\n            printf(\" %d \",j);\r\n        for(j=i-1;j>=1;j--)\r\n            printf(\" %d \",j);\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #32 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #32 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-32-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-102",
    "slug": "nested-for-loop-pattern-33-nested-loops",
    "title": "Pattern #33 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "33th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/33th.c",
    "originalSource": "///question no 33\r\n/*\r\n -  -  -  * \r\n -  -  *  *  * \r\n -  *  *  *  *  * \r\n *  *  *  *  *  *  * \r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j,sp;\r\n    for(i=1;i<=4;i++)\r\n    {\r\n        for(sp=3;sp>=i;sp--)\r\n            printf(\" - \");\r\n        for(j=1;j<=(2*i)-1;j++)\r\n            printf(\" * \");\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "///question no 33\r\n/*\r\n -  -  -  * \r\n -  -  *  *  * \r\n -  *  *  *  *  * \r\n *  *  *  *  *  *  * \r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j,sp;\r\n    for(i=1;i<=4;i++)\r\n    {\r\n        for(sp=3;sp>=i;sp--)\r\n            printf(\" - \");\r\n        for(j=1;j<=(2*i)-1;j++)\r\n            printf(\" * \");\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #33 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #33 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-33-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-103",
    "slug": "nested-for-loop-pattern-3-nested-loops",
    "title": "Pattern #3 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "3rd.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/3rd.c",
    "originalSource": "/*\r\n    1 2 3 4\r\n    1 2 3\r\n    1 2\r\n    1\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j;\r\n    for(i=4;i>=1;i--)\r\n    {\r\n        for(j=1;j<=i;j++)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "/*\r\n    1 2 3 4\r\n    1 2 3\r\n    1 2\r\n    1\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j;\r\n    for(i=4;i>=1;i--)\r\n    {\r\n        for(j=1;j<=i;j++)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #3 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #3 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-3-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-104",
    "slug": "nested-for-loop-pattern-4-nested-loops",
    "title": "Pattern #4 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "4th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/4th.c",
    "originalSource": "/*\r\n    4 3 2 1\r\n    4 3 2\r\n    4 3\r\n    4\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i++)\r\n    {\r\n        for(j=4;j>=i;j--)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "/*\r\n    4 3 2 1\r\n    4 3 2\r\n    4 3\r\n    4\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i++)\r\n    {\r\n        for(j=4;j>=i;j--)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #4 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #4 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-4-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-105",
    "slug": "nested-for-loop-pattern-5-nested-loops",
    "title": "Pattern #5 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "5th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/5th.c",
    "originalSource": "/*\r\n    1 2 3 4\r\n    1 2 3 4\r\n    1 2 3 4\r\n    1 2 3 4\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i++)\r\n    {\r\n        for(j=1;j<=4;j++)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "/*\r\n    1 2 3 4\r\n    1 2 3 4\r\n    1 2 3 4\r\n    1 2 3 4\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i++)\r\n    {\r\n        for(j=1;j<=4;j++)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #5 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #5 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-5-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-106",
    "slug": "nested-for-loop-pattern-6-nested-loops",
    "title": "Pattern #6 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "6th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/6th.c",
    "originalSource": "/*\r\n    1 \r\n    1 2 \r\n    1 2 3 \r\n    1 2 3 4\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i++)\r\n    {\r\n        for(j=1;j<=i;j++)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "/*\r\n    1 \r\n    1 2 \r\n    1 2 3 \r\n    1 2 3 4\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j;\r\n    for(i=1;i<=4;i++)\r\n    {\r\n        for(j=1;j<=i;j++)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #6 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #6 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-6-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-107",
    "slug": "nested-for-loop-pattern-7-nested-loops",
    "title": "Pattern #7 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "7th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/7th.c",
    "originalSource": "/*\r\n    1 3 5 7 9 \r\n    1 3 5 7\r\n    1 3 5\r\n    1 3\r\n    1\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j;\r\n    for(i=9;i>=1;i-=2)\r\n    {\r\n        for(j=1;j<=i;j+=2)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "/*\r\n    1 3 5 7 9 \r\n    1 3 5 7\r\n    1 3 5\r\n    1 3\r\n    1\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j;\r\n    for(i=9;i>=1;i-=2)\r\n    {\r\n        for(j=1;j<=i;j+=2)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #7 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #7 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-7-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-108",
    "slug": "nested-for-loop-pattern-8-nested-loops",
    "title": "Pattern #8 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "8th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/8th.c",
    "originalSource": "/*\r\n    1\r\n    3 1\r\n    5 3 1\r\n    7 5 3 1\r\n    9 7 5 3 1\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j;\r\n    for(i=1;i<=9;i+=2)\r\n    {\r\n        for(j=i;j>=1;j-=2)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "/*\r\n    1\r\n    3 1\r\n    5 3 1\r\n    7 5 3 1\r\n    9 7 5 3 1\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j;\r\n    for(i=1;i<=9;i+=2)\r\n    {\r\n        for(j=i;j>=1;j-=2)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #8 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #8 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-8-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-109",
    "slug": "nested-for-loop-pattern-9-nested-loops",
    "title": "Pattern #9 (Nested Loops)",
    "category": "nested-for-loop",
    "categoryFolder": "Nested for loop",
    "categoryDisplay": "Nested Loops & Patterns",
    "originalFilename": "9th.c",
    "originalPath": "FUNDAMENTALS OF C/Nested for loop/9th.c",
    "originalSource": "/*\r\n    9\r\n    9 7\r\n    9 7 5\r\n    9 7 5 3\r\n    9 7 5 3 1\r\n*/\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,j;\r\n    for(i=9;i>=1;i-=2)\r\n    {\r\n        for(j=9;j>=i;j-=2)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n}",
    "learningSource": "/*\r\n    9\r\n    9 7\r\n    9 7 5\r\n    9 7 5 3\r\n    9 7 5 3 1\r\n*/\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,j;\r\n    for(i=9;i>=1;i-=2)\r\n    {\r\n        for(j=9;j>=i;j-=2)\r\n        {\r\n            printf(\"%d \",j);\r\n        }\r\n        printf(\"\\n\");\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pattern #9 (Nested Loops) from Nested for loop in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pattern #9 (Nested Loops).",
    "tags": [
      "c",
      "nested-for-loop",
      "pattern-9-nested-loops"
    ],
    "difficulty": "easy",
    "defaultInput": "4",
    "presets": [
      {
        "label": "Default Input",
        "value": "4",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "pattern",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-110",
    "slug": "number-checking-abundant",
    "title": "Abundant",
    "category": "number-checking",
    "categoryFolder": "Number Checkinhg",
    "categoryDisplay": "Number Checking & Digit Logic",
    "originalFilename": "Abundant.c",
    "originalPath": "FUNDAMENTALS OF C/Number Checkinhg/Abundant.c",
    "originalSource": "//WAP to check whether a no is Abundant no or not\r\n// Abundant no: A number for which the sum of its proper divisors is greater than the number itself.\r\n// Example: 12 (1+2+3+4+6=16 > 12), 18 (1+2+3+6+9=21 > 18), 20 (1+2+4+5+10=22 > 20)\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int n, i, sum = 0;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for (i = 1; i <= n / 2; i++)\r\n        if (n % i == 0)\r\n            sum += i;\r\n    printf(\"%d is%san Abundant number.\", n, (sum > n) ? \" \" : \" not \");\r\n}",
    "learningSource": "//WAP to check whether a no is Abundant no or not\r\n// Abundant no: A number for which the sum of its proper divisors is greater than the number itself.\r\n// Example: 12 (1+2+3+4+6=16 > 12), 18 (1+2+3+6+9=21 > 18), 20 (1+2+4+5+10=22 > 20)\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int n, i, sum = 0;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for (i = 1; i <= n / 2; i++)\r\n        if (n % i == 0)\r\n            sum += i;\r\n    printf(\"%d is%san Abundant number.\", n, (sum > n) ? \" \" : \" not \");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Abundant from Number Checkinhg in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Abundant.",
    "tags": [
      "c",
      "number-checking",
      "abundant"
    ],
    "difficulty": "easy",
    "defaultInput": "153",
    "presets": [
      {
        "label": "Default Input",
        "value": "153",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "number",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-111",
    "slug": "number-checking-armstrong",
    "title": "Armstrong",
    "category": "number-checking",
    "categoryFolder": "Number Checkinhg",
    "categoryDisplay": "Number Checking & Digit Logic",
    "originalFilename": "Armstrong.c",
    "originalPath": "FUNDAMENTALS OF C/Number Checkinhg/Armstrong.c",
    "originalSource": "// WAP to check whether a no is Armstrong no or not\r\n//  Armstrong no: A number that is equal to the sum of its digits raised to the power of the number of digits.\r\n//  Example: 153 (1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153), 9474 (9^4 + 4^4 + 7^4 + 4^4 = 6561 + 256 + 2401 + 256 = 9474)\r\n#include <stdio.h>\r\n#include <math.h>\r\nvoid main()\r\n{\r\n    int n, i, sum = 0, c = 0, x;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for (x = n; n != 0; n /= 10)\r\n        c++;\r\n    for (n = x, i = n; i != 0; i /= 10)\r\n        sum += pow(i % 10, c);\r\n    printf(\"%d is%san Armstrong number.\", x, (sum == x) ? \" \" : \" not \");\r\n}",
    "learningSource": "// WAP to check whether a no is Armstrong no or not\r\n//  Armstrong no: A number that is equal to the sum of its digits raised to the power of the number of digits.\r\n//  Example: 153 (1^3 + 5^3 + 3^3 = 1 + 125 + 27 = 153), 9474 (9^4 + 4^4 + 7^4 + 4^4 = 6561 + 256 + 2401 + 256 = 9474)\r\n#include <stdio.h>\r\n#include <math.h>\r\nint main(void)\r\n{\r\n    int n, i, sum = 0, c = 0, x;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for (x = n; n != 0; n /= 10)\r\n        c++;\r\n    for (n = x, i = n; i != 0; i /= 10)\r\n        sum += pow(i % 10, c);\r\n    printf(\"%d is%san Armstrong number.\", x, (sum == x) ? \" \" : \" not \");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Armstrong from Number Checkinhg in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Armstrong.",
    "tags": [
      "c",
      "number-checking",
      "armstrong",
      "narcissistic",
      "digit cube"
    ],
    "difficulty": "easy",
    "defaultInput": "153",
    "presets": [
      {
        "label": "Default Input",
        "value": "153",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "number",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-112",
    "slug": "number-checking-caprekar",
    "title": "Caprekar",
    "category": "number-checking",
    "categoryFolder": "Number Checkinhg",
    "categoryDisplay": "Number Checking & Digit Logic",
    "originalFilename": "Caprekar.c",
    "originalPath": "FUNDAMENTALS OF C/Number Checkinhg/Caprekar.c",
    "originalSource": "//WAP to check whether a no is Caprekar no or not\r\n// Caprekar no: A number whose square can be split into two parts that add up to the original number.\r\n// Example: 9 (9^2=81 and 8+1=9), 45 (45^2=2025 and 20+25=45), 297 (297^2=88209 and 88+209=297)\r\n#include<stdio.h>\r\n#include<math.h>\r\nvoid main()\r\n{\r\n    int c=0,rem1,rem2,sq,n,x,p=1,i;\r\n    printf(\"Enter the No = \");\r\n    scanf(\"%d\",&n);\r\n    for(x=n; n>0; n=n/10)\r\n        c++;\r\n    n=x;\r\n    sq=n*n;\r\n    //p=pow(10,c);\r\n    for ( i = 0; i < c; i++) \r\n        p= 10*p;\r\n    rem1=sq%p;\r\n    rem2=sq/p;\r\n    printf(\"%d is%sa Caprekar no\",x, (x==(rem1+rem2)) ? \" \" : \" not \");\r\n}",
    "learningSource": "//WAP to check whether a no is Caprekar no or not\r\n// Caprekar no: A number whose square can be split into two parts that add up to the original number.\r\n// Example: 9 (9^2=81 and 8+1=9), 45 (45^2=2025 and 20+25=45), 297 (297^2=88209 and 88+209=297)\r\n#include<stdio.h>\r\n#include<math.h>\r\nint main(void)\r\n{\r\n    int c=0,rem1,rem2,sq,n,x,p=1,i;\r\n    printf(\"Enter the No = \");\r\n    scanf(\"%d\",&n);\r\n    for(x=n; n>0; n=n/10)\r\n        c++;\r\n    n=x;\r\n    sq=n*n;\r\n    //p=pow(10,c);\r\n    for ( i = 0; i < c; i++) \r\n        p= 10*p;\r\n    rem1=sq%p;\r\n    rem2=sq/p;\r\n    printf(\"%d is%sa Caprekar no\",x, (x==(rem1+rem2)) ? \" \" : \" not \");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Caprekar from Number Checkinhg in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Caprekar.",
    "tags": [
      "c",
      "number-checking",
      "caprekar"
    ],
    "difficulty": "easy",
    "defaultInput": "153",
    "presets": [
      {
        "label": "Default Input",
        "value": "153",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "number",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-113",
    "slug": "number-checking-circularprime",
    "title": "CircularPrime",
    "category": "number-checking",
    "categoryFolder": "Number Checkinhg",
    "categoryDisplay": "Number Checking & Digit Logic",
    "originalFilename": "CircularPrime.c",
    "originalPath": "FUNDAMENTALS OF C/Number Checkinhg/CircularPrime.c",
    "originalSource": "// WAP to check whether a no is Circular Prime no or not\r\n// Circular Prime no: A prime number that remains prime under all rotations of its digits.\r\n// Example: 197 (197, 971, 719 are all prime)\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int n, i, flag = 0, temp;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    temp = n;\r\n    while (temp != 0)\r\n    {\r\n        if (!isPrime(temp))\r\n        {\r\n            flag = 1;\r\n            break;\r\n        }\r\n        temp /= 10;\r\n    }\r\n    printf(\"%d is%sa Circular Prime number.\", n, (flag == 0) ? \" \" : \" not \");\r\n}",
    "learningSource": "// WAP to check whether a no is Circular Prime no or not\r\n// Circular Prime no: A prime number that remains prime under all rotations of its digits.\r\n// Example: 197 (197, 971, 719 are all prime)\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int n, i, flag = 0, temp;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    temp = n;\r\n    while (temp != 0)\r\n    {\r\n        if (!isPrime(temp))\r\n        {\r\n            flag = 1;\r\n            break;\r\n        }\r\n        temp /= 10;\r\n    }\r\n    printf(\"%d is%sa Circular Prime number.\", n, (flag == 0) ? \" \" : \" not \");\r\n\n    return 0;\n}",
    "description": "C educational implementation for CircularPrime from Number Checkinhg in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for CircularPrime.",
    "tags": [
      "c",
      "number-checking",
      "circularprime",
      "prime number",
      "divisibility"
    ],
    "difficulty": "easy",
    "defaultInput": "153",
    "presets": [
      {
        "label": "Default Input",
        "value": "153",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "number",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-114",
    "slug": "number-checking-coprime",
    "title": "CoPrime",
    "category": "number-checking",
    "categoryFolder": "Number Checkinhg",
    "categoryDisplay": "Number Checking & Digit Logic",
    "originalFilename": "CoPrime.c",
    "originalPath": "FUNDAMENTALS OF C/Number Checkinhg/CoPrime.c",
    "originalSource": "//WAP to check whether a no is Co prime or not.\r\n// Co prime no: GCD of two numbers is 1\r\n// Example: 8 and 15 , 14 and 25, 35 and 64, 17 and 20, 9 and 28,4 and 5\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int a, b, i, gcd = 1;\r\n    printf(\"Enter two numbers: \");\r\n    scanf(\"%d %d\", &a, &b);\r\n    for (i = 1; i <= a && i <= b; i++)\r\n        if (a % i == 0 && b % i == 0)\r\n            gcd = i;\r\n    printf(\"%d and %d are%sa prime number.\", a, b, (gcd == 1) ? \" \" : \" not \");\r\n}   ",
    "learningSource": "//WAP to check whether a no is Co prime or not.\r\n// Co prime no: GCD of two numbers is 1\r\n// Example: 8 and 15 , 14 and 25, 35 and 64, 17 and 20, 9 and 28,4 and 5\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int a, b, i, gcd = 1;\r\n    printf(\"Enter two numbers: \");\r\n    scanf(\"%d %d\", &a, &b);\r\n    for (i = 1; i <= a && i <= b; i++)\r\n        if (a % i == 0 && b % i == 0)\r\n            gcd = i;\r\n    printf(\"%d and %d are%sa prime number.\", a, b, (gcd == 1) ? \" \" : \" not \");\r\n\n    return 0;\n}",
    "description": "C educational implementation for CoPrime from Number Checkinhg in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for CoPrime.",
    "tags": [
      "c",
      "number-checking",
      "coprime",
      "prime number",
      "divisibility"
    ],
    "difficulty": "easy",
    "defaultInput": "153",
    "presets": [
      {
        "label": "Default Input",
        "value": "153",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "number",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-115",
    "slug": "number-checking-disarium",
    "title": "Disarium",
    "category": "number-checking",
    "categoryFolder": "Number Checkinhg",
    "categoryDisplay": "Number Checking & Digit Logic",
    "originalFilename": "Disarium.c",
    "originalPath": "FUNDAMENTALS OF C/Number Checkinhg/Disarium.c",
    "originalSource": "// WAP to check whether a no is Disarium no or not\r\n// Disarium no: A number where the sum of its digits raised to the power of their respective positions equals the number itself.\r\n// Example: 135 (1^1 + 3^2 + 5^3 = 1 + 9 + 125 = 135), 89 (8^1 + 9^2 = 8 + 81 = 89)\r\n#include <stdio.h>\r\n#include <math.h>\r\nvoid main()\r\n{\r\n    int n, i, sum = 0, c = 0, x;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for (x = n; n != 0; n /= 10)\r\n        c++;\r\n    for (n = x, i = n; i != 0; i /= 10)\r\n        sum += pow(i % 10, c--);\r\n    printf(\"%d is%sa Disarium number.\", x, (sum == x) ? \" \" : \" not \");\r\n}",
    "learningSource": "// WAP to check whether a no is Disarium no or not\r\n// Disarium no: A number where the sum of its digits raised to the power of their respective positions equals the number itself.\r\n// Example: 135 (1^1 + 3^2 + 5^3 = 1 + 9 + 125 = 135), 89 (8^1 + 9^2 = 8 + 81 = 89)\r\n#include <stdio.h>\r\n#include <math.h>\r\nint main(void)\r\n{\r\n    int n, i, sum = 0, c = 0, x;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for (x = n; n != 0; n /= 10)\r\n        c++;\r\n    for (n = x, i = n; i != 0; i /= 10)\r\n        sum += pow(i % 10, c--);\r\n    printf(\"%d is%sa Disarium number.\", x, (sum == x) ? \" \" : \" not \");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Disarium from Number Checkinhg in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Disarium.",
    "tags": [
      "c",
      "number-checking",
      "disarium"
    ],
    "difficulty": "easy",
    "defaultInput": "153",
    "presets": [
      {
        "label": "Default Input",
        "value": "153",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "number",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-116",
    "slug": "number-checking-duck",
    "title": "Duck",
    "category": "number-checking",
    "categoryFolder": "Number Checkinhg",
    "categoryDisplay": "Number Checking & Digit Logic",
    "originalFilename": "Duck.c",
    "originalPath": "FUNDAMENTALS OF C/Number Checkinhg/Duck.c",
    "originalSource": "//WAP to check whether a no is Duck no or not\r\n// Duck no: A number that has at least one zero in it, but no zero should be present at the beginning of the number.\r\n// Example: 102, 203, 450, 6007 \r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int n, rem, flag = 0;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for (; n != 0; n /= 10)\r\n        if (n % 10 == 0)\r\n        {\r\n            flag = 1;\r\n            break;\r\n        }\r\n    printf(\"The number is%sa Duck number.\", (flag == 1) ? \" \" : \" not \");\r\n}",
    "learningSource": "//WAP to check whether a no is Duck no or not\r\n// Duck no: A number that has at least one zero in it, but no zero should be present at the beginning of the number.\r\n// Example: 102, 203, 450, 6007 \r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int n, rem, flag = 0;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for (; n != 0; n /= 10)\r\n        if (n % 10 == 0)\r\n        {\r\n            flag = 1;\r\n            break;\r\n        }\r\n    printf(\"The number is%sa Duck number.\", (flag == 1) ? \" \" : \" not \");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Duck from Number Checkinhg in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Duck.",
    "tags": [
      "c",
      "number-checking",
      "duck"
    ],
    "difficulty": "easy",
    "defaultInput": "153",
    "presets": [
      {
        "label": "Default Input",
        "value": "153",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "number",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-117",
    "slug": "number-checking-evil",
    "title": "Evil",
    "category": "number-checking",
    "categoryFolder": "Number Checkinhg",
    "categoryDisplay": "Number Checking & Digit Logic",
    "originalFilename": "Evil.c",
    "originalPath": "FUNDAMENTALS OF C/Number Checkinhg/Evil.c",
    "originalSource": "//WAP to check whether a no is Evil number or not\r\n//Evil number: A number that has an even number of 1's in its binary representation.\r\n//Example: 3 (Binary representation is 11, which has two 1's),\r\n//         5 (Binary representation is 101, which has two 1's)\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int n, count = 0, x;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for(x = n; n != 0; n /= 2)\r\n        if (n % 2 == 1)\r\n            count++;\r\n    printf(\"%d is%s an Evil number.\", x, (count % 2 == 0) ? \"\" : \" not\");\r\n} ",
    "learningSource": "//WAP to check whether a no is Evil number or not\r\n//Evil number: A number that has an even number of 1's in its binary representation.\r\n//Example: 3 (Binary representation is 11, which has two 1's),\r\n//         5 (Binary representation is 101, which has two 1's)\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int n, count = 0, x;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for(x = n; n != 0; n /= 2)\r\n        if (n % 2 == 1)\r\n            count++;\r\n    printf(\"%d is%s an Evil number.\", x, (count % 2 == 0) ? \"\" : \" not\");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Evil from Number Checkinhg in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Evil.",
    "tags": [
      "c",
      "number-checking",
      "evil"
    ],
    "difficulty": "easy",
    "defaultInput": "153",
    "presets": [
      {
        "label": "Default Input",
        "value": "153",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "number",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-118",
    "slug": "number-checking-factor-of-a-number",
    "title": "Factor Of A Number",
    "category": "number-checking",
    "categoryFolder": "Number Checkinhg",
    "categoryDisplay": "Number Checking & Digit Logic",
    "originalFilename": "Factor-of-a-No.c",
    "originalPath": "FUNDAMENTALS OF C/Number Checkinhg/Factor-of-a-No.c",
    "originalSource": "//WAP to find all factors of a number\r\n//Example: For input 12, the output should be 1, 2, 3, 4, 6, 12\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int n, i;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    printf(\"Factors of %d are: \", n);\r\n    for (i = 1; i <= n; i++)\r\n        if (n % i == 0)\r\n            printf(\"%d \", i);\r\n}",
    "learningSource": "//WAP to find all factors of a number\r\n//Example: For input 12, the output should be 1, 2, 3, 4, 6, 12\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int n, i;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    printf(\"Factors of %d are: \", n);\r\n    for (i = 1; i <= n; i++)\r\n        if (n % i == 0)\r\n            printf(\"%d \", i);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Factor Of A Number from Number Checkinhg in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Factor Of A Number.",
    "tags": [
      "c",
      "number-checking",
      "factor-of-a-number"
    ],
    "difficulty": "easy",
    "defaultInput": "153",
    "presets": [
      {
        "label": "Default Input",
        "value": "153",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "number",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-119",
    "slug": "number-checking-harshad",
    "title": "Harshad",
    "category": "number-checking",
    "categoryFolder": "Number Checkinhg",
    "categoryDisplay": "Number Checking & Digit Logic",
    "originalFilename": "Harshad.c",
    "originalPath": "FUNDAMENTALS OF C/Number Checkinhg/Harshad.c",
    "originalSource": "//WAP to check whether a no is Harshad no or not \r\n// Harshad no: A number that is divisible by the sum of its digits.\r\n// Example: 18 (1+8=9 and 18 is divisible by 9), 21 (2+1=3 and 21 is divisible by 3), 45 (4+5=9 and 45 is divisible by 9)\r\n#include <stdio.h>  \r\nvoid main()  \r\n{  \r\n    int n, sum = 0, temp, rem;  \r\n    printf(\"Enter a number: \");  \r\n    scanf(\"%d\", &n);  \r\n    for(temp = n; temp != 0; temp /= 10)  \r\n        sum += temp % 10;   \r\n    printf(\"%d is a Harshad number.\", n, (n % sum == 0) ? \" \" : \" not \");  \r\n}",
    "learningSource": "//WAP to check whether a no is Harshad no or not \r\n// Harshad no: A number that is divisible by the sum of its digits.\r\n// Example: 18 (1+8=9 and 18 is divisible by 9), 21 (2+1=3 and 21 is divisible by 3), 45 (4+5=9 and 45 is divisible by 9)\r\n#include <stdio.h>  \r\nint main(void)  \r\n{  \r\n    int n, sum = 0, temp, rem;  \r\n    printf(\"Enter a number: \");  \r\n    scanf(\"%d\", &n);  \r\n    for(temp = n; temp != 0; temp /= 10)  \r\n        sum += temp % 10;   \r\n    printf(\"%d is a Harshad number.\", n, (n % sum == 0) ? \" \" : \" not \");  \r\n\n    return 0;\n}",
    "description": "C educational implementation for Harshad from Number Checkinhg in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Harshad.",
    "tags": [
      "c",
      "number-checking",
      "harshad"
    ],
    "difficulty": "easy",
    "defaultInput": "153",
    "presets": [
      {
        "label": "Default Input",
        "value": "153",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "number",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-120",
    "slug": "number-checking-krishnamurthy",
    "title": "Krishnamurthy",
    "category": "number-checking",
    "categoryFolder": "Number Checkinhg",
    "categoryDisplay": "Number Checking & Digit Logic",
    "originalFilename": "Krishnamurthy.c",
    "originalPath": "FUNDAMENTALS OF C/Number Checkinhg/Krishnamurthy.c",
    "originalSource": "// WAP to check whether a no is Krishnamurthy no or not\r\n// Krishnamurthy no: A number where the sum of the factorials of its digits equals the number itself.\r\n// Example: 145 (1! + 4! + 5! = 1 + 24 + 120 = 145)\r\n#include <stdio.h>\r\nint factorial(int n)\r\n{\r\n    if (n == 0 || n == 1)\r\n        return 1;\r\n    return n * factorial(n - 1);\r\n}\r\nvoid main()\r\n{\r\n    int n, i, sum = 0, x;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for (x = n; n != 0; n /= 10)\r\n        sum += factorial(n % 10);\r\n    printf(\"%d is%sa Krishnamurthy number.\", x, (sum == x) ? \" \" : \" not \");\r\n}",
    "learningSource": "// WAP to check whether a no is Krishnamurthy no or not\r\n// Krishnamurthy no: A number where the sum of the factorials of its digits equals the number itself.\r\n// Example: 145 (1! + 4! + 5! = 1 + 24 + 120 = 145)\r\n#include <stdio.h>\r\nint factorial(int n)\r\n{\r\n    if (n == 0 || n == 1)\r\n        return 1;\r\n    return n * factorial(n - 1);\r\n}\r\nint main(void)\r\n{\r\n    int n, i, sum = 0, x;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for (x = n; n != 0; n /= 10)\r\n        sum += factorial(n % 10);\r\n    printf(\"%d is%sa Krishnamurthy number.\", x, (sum == x) ? \" \" : \" not \");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Krishnamurthy from Number Checkinhg in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Krishnamurthy.",
    "tags": [
      "c",
      "number-checking",
      "krishnamurthy"
    ],
    "difficulty": "easy",
    "defaultInput": "153",
    "presets": [
      {
        "label": "Default Input",
        "value": "153",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "number",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-121",
    "slug": "number-checking-magic",
    "title": "Magic",
    "category": "number-checking",
    "categoryFolder": "Number Checkinhg",
    "categoryDisplay": "Number Checking & Digit Logic",
    "originalFilename": "Magic.c",
    "originalPath": "FUNDAMENTALS OF C/Number Checkinhg/Magic.c",
    "originalSource": "// WAP to check whether a no is Magic no or not\r\n// Magic no: A number where the sum of its digits, when repeatedly added until a single digit is obtained, equals 1.\r\n// Example: 28 (2+8=10, then 1+0=1), 19 (1+9=10, then 1+0=1)\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int n, i, sum = 0, x;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for (x = n; n != 0; n /= 10)\r\n        sum += n % 10;\r\n    while (sum > 9)\r\n        sum = sum / 10 + sum % 10;\r\n    printf(\"%d is%sa Magic number.\", x, (sum == 1) ? \" \" : \" not \");\r\n}",
    "learningSource": "// WAP to check whether a no is Magic no or not\r\n// Magic no: A number where the sum of its digits, when repeatedly added until a single digit is obtained, equals 1.\r\n// Example: 28 (2+8=10, then 1+0=1), 19 (1+9=10, then 1+0=1)\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int n, i, sum = 0, x;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for (x = n; n != 0; n /= 10)\r\n        sum += n % 10;\r\n    while (sum > 9)\r\n        sum = sum / 10 + sum % 10;\r\n    printf(\"%d is%sa Magic number.\", x, (sum == 1) ? \" \" : \" not \");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Magic from Number Checkinhg in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Magic.",
    "tags": [
      "c",
      "number-checking",
      "magic"
    ],
    "difficulty": "easy",
    "defaultInput": "153",
    "presets": [
      {
        "label": "Default Input",
        "value": "153",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "number",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-122",
    "slug": "number-checking-neon",
    "title": "Neon",
    "category": "number-checking",
    "categoryFolder": "Number Checkinhg",
    "categoryDisplay": "Number Checking & Digit Logic",
    "originalFilename": "Neon.c",
    "originalPath": "FUNDAMENTALS OF C/Number Checkinhg/Neon.c",
    "originalSource": "// WAP to check whether a no is Neon no or not\r\n// Neon no: A number where the sum of the digits of its square is equal to the number itself.\r\n// Example: 9 (9^2=81 and 8+1=9),45 (45^2=2025 and 2+0+2+5=9)\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int n, i, sum = 0, x;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for (x = n, i = n * n; i != 0; i /= 10)\r\n        sum += i % 10;\r\n    printf(\"%d is%sa Neon number.\", x, (sum == x) ? \" \" : \" not \");\r\n}",
    "learningSource": "// WAP to check whether a no is Neon no or not\r\n// Neon no: A number where the sum of the digits of its square is equal to the number itself.\r\n// Example: 9 (9^2=81 and 8+1=9),45 (45^2=2025 and 2+0+2+5=9)\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int n, i, sum = 0, x;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for (x = n, i = n * n; i != 0; i /= 10)\r\n        sum += i % 10;\r\n    printf(\"%d is%sa Neon number.\", x, (sum == x) ? \" \" : \" not \");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Neon from Number Checkinhg in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Neon.",
    "tags": [
      "c",
      "number-checking",
      "neon"
    ],
    "difficulty": "easy",
    "defaultInput": "153",
    "presets": [
      {
        "label": "Default Input",
        "value": "153",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "number",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-123",
    "slug": "number-checking-palinrome",
    "title": "Palinrome",
    "category": "number-checking",
    "categoryFolder": "Number Checkinhg",
    "categoryDisplay": "Number Checking & Digit Logic",
    "originalFilename": "Palinrome.c",
    "originalPath": "FUNDAMENTALS OF C/Number Checkinhg/Palinrome.c",
    "originalSource": "// WAP to check whether a given no is a palindrome or not.\r\n// 121 reverse=121 palindrome\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int n, r, sum = 0, temp;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for (temp = n; n != 0; n /= 10)\r\n        sum = sum * 10 + n % 10;\r\n    printf(\"The number is%sa palindrome.\", (sum == temp) ? \" \" : \" not \");\r\n}",
    "learningSource": "// WAP to check whether a given no is a palindrome or not.\r\n// 121 reverse=121 palindrome\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int n, r, sum = 0, temp;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for (temp = n; n != 0; n /= 10)\r\n        sum = sum * 10 + n % 10;\r\n    printf(\"The number is%sa palindrome.\", (sum == temp) ? \" \" : \" not \");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Palinrome from Number Checkinhg in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Palinrome.",
    "tags": [
      "c",
      "number-checking",
      "palinrome"
    ],
    "difficulty": "easy",
    "defaultInput": "153",
    "presets": [
      {
        "label": "Default Input",
        "value": "153",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "number",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-124",
    "slug": "number-checking-perfect",
    "title": "Perfect",
    "category": "number-checking",
    "categoryFolder": "Number Checkinhg",
    "categoryDisplay": "Number Checking & Digit Logic",
    "originalFilename": "Perfect.c",
    "originalPath": "FUNDAMENTALS OF C/Number Checkinhg/Perfect.c",
    "originalSource": "// WAP to check whether a no is Perfect no or not\r\n//  Perfect no: A number that is equal to the sum of its proper divisors.\r\n//  Example: 6 (1+2+3=6), 28 (1+2+4+7+14=28)\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int n, i, sum = 0;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for (i = 1; i <= n / 2; i++)\r\n        if (n % i == 0)\r\n            sum += i;\r\n    printf(\"%d is%sa Perfect number.\", n, (sum == n) ? \" \" : \" not \");\r\n}",
    "learningSource": "// WAP to check whether a no is Perfect no or not\r\n//  Perfect no: A number that is equal to the sum of its proper divisors.\r\n//  Example: 6 (1+2+3=6), 28 (1+2+4+7+14=28)\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int n, i, sum = 0;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for (i = 1; i <= n / 2; i++)\r\n        if (n % i == 0)\r\n            sum += i;\r\n    printf(\"%d is%sa Perfect number.\", n, (sum == n) ? \" \" : \" not \");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Perfect from Number Checkinhg in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Perfect.",
    "tags": [
      "c",
      "number-checking",
      "perfect"
    ],
    "difficulty": "easy",
    "defaultInput": "153",
    "presets": [
      {
        "label": "Default Input",
        "value": "153",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "number",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-125",
    "slug": "number-checking-prime",
    "title": "Prime",
    "category": "number-checking",
    "categoryFolder": "Number Checkinhg",
    "categoryDisplay": "Number Checking & Digit Logic",
    "originalFilename": "Prime.c",
    "originalPath": "FUNDAMENTALS OF C/Number Checkinhg/Prime.c",
    "originalSource": "//WAP to check whether a no is prime or not.\r\n// prime no: 2,3,5,7,11,13\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int n, i, flag = 0;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for (i = 2; i <= n / 2; i++)\r\n        if (n % i == 0)\r\n        {\r\n            flag = 1;\r\n            break;\r\n        }\r\n    printf(\"%d is%sa prime number.\", n, (flag == 0) ? \" \" : \" not \");\r\n}",
    "learningSource": "//WAP to check whether a no is prime or not.\r\n// prime no: 2,3,5,7,11,13\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int n, i, flag = 0;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for (i = 2; i <= n / 2; i++)\r\n        if (n % i == 0)\r\n        {\r\n            flag = 1;\r\n            break;\r\n        }\r\n    printf(\"%d is%sa prime number.\", n, (flag == 0) ? \" \" : \" not \");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Prime from Number Checkinhg in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Prime.",
    "tags": [
      "c",
      "number-checking",
      "prime",
      "prime number",
      "divisibility"
    ],
    "difficulty": "easy",
    "defaultInput": "153",
    "presets": [
      {
        "label": "Default Input",
        "value": "153",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "number",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-126",
    "slug": "number-checking-pronic",
    "title": "Pronic",
    "category": "number-checking",
    "categoryFolder": "Number Checkinhg",
    "categoryDisplay": "Number Checking & Digit Logic",
    "originalFilename": "Pronic.c",
    "originalPath": "FUNDAMENTALS OF C/Number Checkinhg/Pronic.c",
    "originalSource": "// WAP to check whether a no is Pronic no or not\r\n// Pronic no: A number that is the product of two consecutive integers.\r\n// Example: 6 (2*3=6), 12 (3*4=12)\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int n, i, flag = 0;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for (i = 0; i <= n; i++)\r\n        if (i * (i + 1) == n)\r\n        {\r\n            flag = 1;\r\n            break;\r\n        }\r\n    printf(\"%d is%sa Pronic number.\", n, (flag == 1) ? \" \" : \" not \");\r\n}",
    "learningSource": "// WAP to check whether a no is Pronic no or not\r\n// Pronic no: A number that is the product of two consecutive integers.\r\n// Example: 6 (2*3=6), 12 (3*4=12)\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int n, i, flag = 0;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for (i = 0; i <= n; i++)\r\n        if (i * (i + 1) == n)\r\n        {\r\n            flag = 1;\r\n            break;\r\n        }\r\n    printf(\"%d is%sa Pronic number.\", n, (flag == 1) ? \" \" : \" not \");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Pronic from Number Checkinhg in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Pronic.",
    "tags": [
      "c",
      "number-checking",
      "pronic"
    ],
    "difficulty": "easy",
    "defaultInput": "153",
    "presets": [
      {
        "label": "Default Input",
        "value": "153",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "number",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-127",
    "slug": "number-checking-spy",
    "title": "Spy",
    "category": "number-checking",
    "categoryFolder": "Number Checkinhg",
    "categoryDisplay": "Number Checking & Digit Logic",
    "originalFilename": "Spy.c",
    "originalPath": "FUNDAMENTALS OF C/Number Checkinhg/Spy.c",
    "originalSource": "// WAP to check whether a no is Spy no or not\r\n// Spy no: A number where the sum of its digits equals the product of its digits.\r\n// Example: 123 (1+2+3=6 and 1*2*3=6), 22 (2+2=4 and 2*2=4)\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int n, i, sum = 0, product = 1, x;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for (x = n; n != 0; n /= 10)\r\n        sum += n % 10;\r\n    for (n = x; n != 0; n /= 10)\r\n        product *= n % 10;\r\n    printf(\"%d is%sa Spy number.\", x, (sum == product) ? \" \" : \" not \");\r\n}",
    "learningSource": "// WAP to check whether a no is Spy no or not\r\n// Spy no: A number where the sum of its digits equals the product of its digits.\r\n// Example: 123 (1+2+3=6 and 1*2*3=6), 22 (2+2=4 and 2*2=4)\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int n, i, sum = 0, product = 1, x;\r\n    printf(\"Enter a number: \");\r\n    scanf(\"%d\", &n);\r\n    for (x = n; n != 0; n /= 10)\r\n        sum += n % 10;\r\n    for (n = x; n != 0; n /= 10)\r\n        product *= n % 10;\r\n    printf(\"%d is%sa Spy number.\", x, (sum == product) ? \" \" : \" not \");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Spy from Number Checkinhg in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Spy.",
    "tags": [
      "c",
      "number-checking",
      "spy"
    ],
    "difficulty": "easy",
    "defaultInput": "153",
    "presets": [
      {
        "label": "Default Input",
        "value": "153",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "number",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-128",
    "slug": "number-checking-tech",
    "title": "Tech",
    "category": "number-checking",
    "categoryFolder": "Number Checkinhg",
    "categoryDisplay": "Number Checking & Digit Logic",
    "originalFilename": "Tech.c",
    "originalPath": "FUNDAMENTALS OF C/Number Checkinhg/Tech.c",
    "originalSource": "// WAP to check whether a number is Tech number or not\r\n#include <stdio.h>\r\n#include <math.h>\r\n\r\nint main()\r\n{\r\n    int a, x, rem1, rem2, s, c = 0, p=1;\r\n\r\n    printf(\"Enter the No = \");\r\n    scanf(\"%d\", &a);\r\n\r\n    x = a;\r\n\r\n    // Count digits\r\n    while (x != 0)\r\n    {\r\n        c++;\r\n        x = x / 10;\r\n    }\r\n\r\n    // Check even number of digits\r\n    if (c % 2 != 0)\r\n    {\r\n        printf(\"%d is not a Tech No.\", a);\r\n        return 0;\r\n    }\r\n\r\n    // Calculate 10^(c/2)\r\n    p = pow(10, c / 2);\r\n\r\n    rem1 = a / p;\r\n    rem2 = a % p;\r\n\r\n    s = rem1 + rem2;\r\n\r\n    if (s * s == a)\r\n        printf(\"%d is a Tech No.\", a);\r\n    else\r\n        printf(\"%d is not a Tech No.\", a);\r\n\r\n    return 0;\r\n}\r\n",
    "learningSource": "// WAP to check whether a number is Tech number or not\r\n#include <stdio.h>\r\n#include <math.h>\r\n\r\nint main()\r\n{\r\n    int a, x, rem1, rem2, s, c = 0, p=1;\r\n\r\n    printf(\"Enter the No = \");\r\n    scanf(\"%d\", &a);\r\n\r\n    x = a;\r\n\r\n    // Count digits\r\n    while (x != 0)\r\n    {\r\n        c++;\r\n        x = x / 10;\r\n    }\r\n\r\n    // Check even number of digits\r\n    if (c % 2 != 0)\r\n    {\r\n        printf(\"%d is not a Tech No.\", a);\r\n        return 0;\r\n    }\r\n\r\n    // Calculate 10^(c/2)\r\n    p = pow(10, c / 2);\r\n\r\n    rem1 = a / p;\r\n    rem2 = a % p;\r\n\r\n    s = rem1 + rem2;\r\n\r\n    if (s * s == a)\r\n        printf(\"%d is a Tech No.\", a);\r\n    else\r\n        printf(\"%d is not a Tech No.\", a);\r\n\r\n    return 0;\r\n}\r\n",
    "description": "C educational implementation for Tech from Number Checkinhg in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Tech.",
    "tags": [
      "c",
      "number-checking",
      "tech"
    ],
    "difficulty": "easy",
    "defaultInput": "153",
    "presets": [
      {
        "label": "Default Input",
        "value": "153",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "number",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-129",
    "slug": "number-checking-twinprime",
    "title": "TwinPrime",
    "category": "number-checking",
    "categoryFolder": "Number Checkinhg",
    "categoryDisplay": "Number Checking & Digit Logic",
    "originalFilename": "TwinPrime.c",
    "originalPath": "FUNDAMENTALS OF C/Number Checkinhg/TwinPrime.c",
    "originalSource": "//WAP to check whether a given no is Twin prime or not.\r\n// Twin prime no: A pair of prime numbers that have a difference of two and both numbers are prime.\r\n// Example: (3,5), (5,7), (11,13), (17,19), (29,31)\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int a, b, i, flag1 = 0, flag2 = 0;\r\n    printf(\"Enter two numbers: \");\r\n    scanf(\"%d %d\", &a, &b);\r\n    for (i = 2; i <= a / 2; i++)\r\n        if (a % i == 0)\r\n        {\r\n            flag1 = 1;\r\n            break;\r\n        }\r\n    for (i = 2; i <= b / 2; i++)\r\n        if (b % i == 0)\r\n        {\r\n            flag2 = 1;\r\n            break;\r\n        }\r\n    if (flag1 == 0 && flag2 == 0 && ((b - a) == 2 || (a - b) == 2))\r\n        printf(\"The numbers are twin primes.\");\r\n    else\r\n        printf(\"The numbers are not twin primes.\");\r\n}",
    "learningSource": "//WAP to check whether a given no is Twin prime or not.\r\n// Twin prime no: A pair of prime numbers that have a difference of two and both numbers are prime.\r\n// Example: (3,5), (5,7), (11,13), (17,19), (29,31)\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int a, b, i, flag1 = 0, flag2 = 0;\r\n    printf(\"Enter two numbers: \");\r\n    scanf(\"%d %d\", &a, &b);\r\n    for (i = 2; i <= a / 2; i++)\r\n        if (a % i == 0)\r\n        {\r\n            flag1 = 1;\r\n            break;\r\n        }\r\n    for (i = 2; i <= b / 2; i++)\r\n        if (b % i == 0)\r\n        {\r\n            flag2 = 1;\r\n            break;\r\n        }\r\n    if (flag1 == 0 && flag2 == 0 && ((b - a) == 2 || (a - b) == 2))\r\n        printf(\"The numbers are twin primes.\");\r\n    else\r\n        printf(\"The numbers are not twin primes.\");\r\n\n    return 0;\n}",
    "description": "C educational implementation for TwinPrime from Number Checkinhg in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for TwinPrime.",
    "tags": [
      "c",
      "number-checking",
      "twinprime",
      "prime number",
      "divisibility"
    ],
    "difficulty": "easy",
    "defaultInput": "153",
    "presets": [
      {
        "label": "Default Input",
        "value": "153",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "number",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-130",
    "slug": "number-checking-twistedprime",
    "title": "TwistedPrime",
    "category": "number-checking",
    "categoryFolder": "Number Checkinhg",
    "categoryDisplay": "Number Checking & Digit Logic",
    "originalFilename": "TwistedPrime.c",
    "originalPath": "FUNDAMENTALS OF C/Number Checkinhg/TwistedPrime.c",
    "originalSource": "// WAP to check whether a no is Twisted prime or not\r\n// Twisted prime no: A prime number whose reverse is also a prime number.\r\n// Example: (13,31), (17,71), (37,73), (79,97), (107,701)\r\n#include <stdio.h>\r\nvoid main()\r\n{\r\n    int a, rem, x, i, c1 = 0, c2 = 0, s = 0;\r\n    printf(\"Enter the no = \");\r\n    scanf(\"%d\", &a);\r\n    for (x = a; x != 0; x /= 10)\r\n        s = s * 10 + x % 10;\r\n    x = a;\r\n    for (i = 2; i < a; i++)\r\n        if (a % i == 0)\r\n        {\r\n            c1++;\r\n            break;\r\n        }\r\n    for (i = 2; i < s; i++)\r\n        if (s % i == 0)\r\n        {\r\n            c2++;\r\n            break;\r\n        }\r\n    printf(\"%d is%sa Twisted Prime No\", a, (c1 == 0 && c2 == 0) ? \" \" : \" not \");\r\n}",
    "learningSource": "// WAP to check whether a no is Twisted prime or not\r\n// Twisted prime no: A prime number whose reverse is also a prime number.\r\n// Example: (13,31), (17,71), (37,73), (79,97), (107,701)\r\n#include <stdio.h>\r\nint main(void)\r\n{\r\n    int a, rem, x, i, c1 = 0, c2 = 0, s = 0;\r\n    printf(\"Enter the no = \");\r\n    scanf(\"%d\", &a);\r\n    for (x = a; x != 0; x /= 10)\r\n        s = s * 10 + x % 10;\r\n    x = a;\r\n    for (i = 2; i < a; i++)\r\n        if (a % i == 0)\r\n        {\r\n            c1++;\r\n            break;\r\n        }\r\n    for (i = 2; i < s; i++)\r\n        if (s % i == 0)\r\n        {\r\n            c2++;\r\n            break;\r\n        }\r\n    printf(\"%d is%sa Twisted Prime No\", a, (c1 == 0 && c2 == 0) ? \" \" : \" not \");\r\n\n    return 0;\n}",
    "description": "C educational implementation for TwistedPrime from Number Checkinhg in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for TwistedPrime.",
    "tags": [
      "c",
      "number-checking",
      "twistedprime",
      "prime number",
      "divisibility"
    ],
    "difficulty": "easy",
    "defaultInput": "153",
    "presets": [
      {
        "label": "Default Input",
        "value": "153",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "number",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-131",
    "slug": "sorting-binary-search",
    "title": "Binary Search",
    "category": "sorting",
    "categoryFolder": "Sorting",
    "categoryDisplay": "Sorting & Searching",
    "originalFilename": "Binary_Search.c",
    "originalPath": "FUNDAMENTALS OF C/Sorting/Binary_Search.c",
    "originalSource": "//Binary Search\r\n\r\n#include <stdio.h>\r\n#include <conio.h>\r\nvoid main()\r\n{\r\n  int c, f, last, m, n, ser, a[100];\r\n  printf(\"Enter number of elements\\n\");\r\n  scanf(\"%d\", &n);//n=5\r\n  printf(\"Enter %d integers\\n\", n);\r\n  //input\r\n  for (c = 0; c < n; c++)\r\n  {\r\n    printf(\"Enter the No.=\");\r\n    scanf(\"%d\", &a[c]);//10,20,30,40,50\r\n  }\r\n  printf(\"Enter value to find\\n\");\r\n  scanf(\"%d\", &ser);//ser=40\r\n  f = 0;//f=0\r\n  last = n - 1;//last=4\r\n  m = (f+last)/2;//m=2\r\n  for(;f <= last;m = (f + last)/2) //1<=4\r\n  {\r\n    if (a[m] < ser) //a[0]<20  10<60\r\n      f = m + 1;//f=1\r\n    else if (a[m] == ser) //10==60\r\n    {\r\n      printf(\"%d found at %d index %d location %d.\\n\", ser,m, m+1);\r\n      break;\r\n    }\r\n    else \r\n      last = m - 1;//last=-1\r\n  }\r\n  if (f > last)\r\n    printf(\"Not found! %d isn't present in the list.\\n\", ser);\r\n  getch();\r\n}",
    "learningSource": "//Binary Search\r\n\r\n#include <stdio.h>\r\n#include <conio.h>\r\nint main(void)\r\n{\r\n  int c, f, last, m, n, ser, a[100];\r\n  printf(\"Enter number of elements\\n\");\r\n  scanf(\"%d\", &n);//n=5\r\n  printf(\"Enter %d integers\\n\", n);\r\n  //input\r\n  for (c = 0; c < n; c++)\r\n  {\r\n    printf(\"Enter the No.=\");\r\n    scanf(\"%d\", &a[c]);//10,20,30,40,50\r\n  }\r\n  printf(\"Enter value to find\\n\");\r\n  scanf(\"%d\", &ser);//ser=40\r\n  f = 0;//f=0\r\n  last = n - 1;//last=4\r\n  m = (f+last)/2;//m=2\r\n  for(;f <= last;m = (f + last)/2) //1<=4\r\n  {\r\n    if (a[m] < ser) //a[0]<20  10<60\r\n      f = m + 1;//f=1\r\n    else if (a[m] == ser) //10==60\r\n    {\r\n      printf(\"%d found at %d index %d location %d.\\n\", ser,m, m+1);\r\n      break;\r\n    }\r\n    else \r\n      last = m - 1;//last=-1\r\n  }\r\n  if (f > last)\r\n    printf(\"Not found! %d isn't present in the list.\\n\", ser);\r\n  getch();\r\n\n    return 0;\n}",
    "description": "C educational implementation for Binary Search from Sorting in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Binary Search.",
    "tags": [
      "c",
      "sorting",
      "binary-search",
      "binary search",
      "linear search",
      "find"
    ],
    "difficulty": "easy",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "search",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-132",
    "slug": "sorting-bubble",
    "title": "Bubble",
    "category": "sorting",
    "categoryFolder": "Sorting",
    "categoryDisplay": "Sorting & Searching",
    "originalFilename": "Bubble.c",
    "originalPath": "FUNDAMENTALS OF C/Sorting/Bubble.c",
    "originalSource": "//bubble sort\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n int i,j,n,temp=0,k=1,count=0;\r\n printf(\"Enter the Range=\");\r\n scanf(\"%d\",&n);\r\n int a[n];\r\n //input\r\n for(i=0;i<n;i++)\r\n {\r\n  printf(\"Enter the No.=\");\r\n  scanf(\"%d\",&a[i]);\r\n }\r\n //bubble sort\r\n printf(\"\\nAfter Sorting= \");\r\n for(i=0;i<n;i++)\r\n {\r\n  count++;\r\n   for(j=0;j<n-1;j++)\r\n   {\r\n      count++;\r\n      if(a[j]>a[j+1])\r\n      {\r\n        temp=a[j];\r\n        a[j]=a[j+1];\r\n        a[j+1]=temp;\r\n      }\r\n   }\r\n    printf(\"\\nIteration %d=\",k);\r\n    k++;\r\n    printf(\"\\n\");\r\n    for(j=0;j<n;j++)\r\n    {\r\n      printf(\"%d \",a[j]);\r\n    }\r\n    printf(\"\\nTotal Iteration = %d\",count);\r\n  }\r\n}",
    "learningSource": "//bubble sort\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n int i,j,n,temp=0,k=1,count=0;\r\n printf(\"Enter the Range=\");\r\n scanf(\"%d\",&n);\r\n int a[n];\r\n //input\r\n for(i=0;i<n;i++)\r\n {\r\n  printf(\"Enter the No.=\");\r\n  scanf(\"%d\",&a[i]);\r\n }\r\n //bubble sort\r\n printf(\"\\nAfter Sorting= \");\r\n for(i=0;i<n;i++)\r\n {\r\n  count++;\r\n   for(j=0;j<n-1;j++)\r\n   {\r\n      count++;\r\n      if(a[j]>a[j+1])\r\n      {\r\n        temp=a[j];\r\n        a[j]=a[j+1];\r\n        a[j+1]=temp;\r\n      }\r\n   }\r\n    printf(\"\\nIteration %d=\",k);\r\n    k++;\r\n    printf(\"\\n\");\r\n    for(j=0;j<n;j++)\r\n    {\r\n      printf(\"%d \",a[j]);\r\n    }\r\n    printf(\"\\nTotal Iteration = %d\",count);\r\n  }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Bubble from Sorting in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Bubble.",
    "tags": [
      "c",
      "sorting",
      "bubble",
      "sorting algorithm",
      "comparisons",
      "swaps"
    ],
    "difficulty": "easy",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "sorting",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-133",
    "slug": "sorting-insertion",
    "title": "Insertion",
    "category": "sorting",
    "categoryFolder": "Sorting",
    "categoryDisplay": "Sorting & Searching",
    "originalFilename": "Insertion.c",
    "originalPath": "FUNDAMENTALS OF C/Sorting/Insertion.c",
    "originalSource": "//insertion sort\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n int a[10],n;\r\n int i,j,temp,k,ite=1;\r\n printf(\"Enter the Range=\");\r\n scanf(\"%d\",&n);\r\n //input\r\n for(i=0;i<n;i++)\r\n {\r\n   printf(\"Enter the No.=\");\r\n   scanf(\"%d\",&a[i]);\r\n }\r\n  //insertion sorting\r\n  for(i=1;i<n;i++)\r\n  {\r\n    j=i;\r\n    while(j>0 && a[j-1]>a[j])\r\n     {\r\n       temp=a[j-1];\r\n       a[j-1]=a[j];\r\n       a[j]=temp;\r\n       j--;\r\n    }\r\n     //printing\r\n     printf(\"Iteration %d = \",ite);\r\n for(k=0;k<n;k++)\r\n  printf(\"%d \",a[k]);\r\n printf(\"\\n\");\r\n ite++;\r\n  }\r\n}",
    "learningSource": "//insertion sort\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n int a[10],n;\r\n int i,j,temp,k,ite=1;\r\n printf(\"Enter the Range=\");\r\n scanf(\"%d\",&n);\r\n //input\r\n for(i=0;i<n;i++)\r\n {\r\n   printf(\"Enter the No.=\");\r\n   scanf(\"%d\",&a[i]);\r\n }\r\n  //insertion sorting\r\n  for(i=1;i<n;i++)\r\n  {\r\n    j=i;\r\n    while(j>0 && a[j-1]>a[j])\r\n     {\r\n       temp=a[j-1];\r\n       a[j-1]=a[j];\r\n       a[j]=temp;\r\n       j--;\r\n    }\r\n     //printing\r\n     printf(\"Iteration %d = \",ite);\r\n for(k=0;k<n;k++)\r\n  printf(\"%d \",a[k]);\r\n printf(\"\\n\");\r\n ite++;\r\n  }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Insertion from Sorting in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Insertion.",
    "tags": [
      "c",
      "sorting",
      "insertion"
    ],
    "difficulty": "easy",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "sorting",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-134",
    "slug": "sorting-linear-search",
    "title": "Linear Search",
    "category": "sorting",
    "categoryFolder": "Sorting",
    "categoryDisplay": "Sorting & Searching",
    "originalFilename": "Linear_Search.c",
    "originalPath": "FUNDAMENTALS OF C/Sorting/Linear_Search.c",
    "originalSource": "//WAP to search an element within an array (linear serach tech.) repeated element\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n    int i,n,ser,f=0,c=0;\r\n    printf(\"Enter the Range = \");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    //input\r\n    for(i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the No. = \");\r\n        scanf(\"%d\",&a[i]);\r\n    }\r\n    //output\r\n    printf(\"Array Element = \");\r\n    for(i=0;i<n;i++)\r\n    {\r\n        printf(\"%d \",a[i]);\r\n    }\r\n    //checking\r\n    printf(\"\\nEnter the No. you want to searched for = \");\r\n    scanf(\"%d\",&ser);\r\n    for(i=0;i<n;i++)\r\n    {\r\n       if(a[i]==ser)\r\n       {\r\n          f=1;\r\n          printf(\"Search element %d Found at %d index\\n\",ser,i);\r\n          c++;\r\n       }\r\n    }\r\n    if(f==1)\r\n      printf(\"%d No. of Times\",c);\r\n    else\r\n      printf(\"Search element %d NOT Found \",ser);\r\n}",
    "learningSource": "//WAP to search an element within an array (linear serach tech.) repeated element\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n    int i,n,ser,f=0,c=0;\r\n    printf(\"Enter the Range = \");\r\n    scanf(\"%d\",&n);\r\n    int a[n];\r\n    //input\r\n    for(i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the No. = \");\r\n        scanf(\"%d\",&a[i]);\r\n    }\r\n    //output\r\n    printf(\"Array Element = \");\r\n    for(i=0;i<n;i++)\r\n    {\r\n        printf(\"%d \",a[i]);\r\n    }\r\n    //checking\r\n    printf(\"\\nEnter the No. you want to searched for = \");\r\n    scanf(\"%d\",&ser);\r\n    for(i=0;i<n;i++)\r\n    {\r\n       if(a[i]==ser)\r\n       {\r\n          f=1;\r\n          printf(\"Search element %d Found at %d index\\n\",ser,i);\r\n          c++;\r\n       }\r\n    }\r\n    if(f==1)\r\n      printf(\"%d No. of Times\",c);\r\n    else\r\n      printf(\"Search element %d NOT Found \",ser);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Linear Search from Sorting in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Linear Search.",
    "tags": [
      "c",
      "sorting",
      "linear-search",
      "binary search",
      "linear search",
      "find"
    ],
    "difficulty": "easy",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "search",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-135",
    "slug": "sorting-modified-bubble",
    "title": "Modified Bubble",
    "category": "sorting",
    "categoryFolder": "Sorting",
    "categoryDisplay": "Sorting & Searching",
    "originalFilename": "Modified_Bubble.c",
    "originalPath": "FUNDAMENTALS OF C/Sorting/Modified_Bubble.c",
    "originalSource": "//modified bubble sort\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n int i,j,n,temp=0,k=1,count=0;\r\n printf(\"Enter the Range=\");\r\n scanf(\"%d\",&n);\r\n int a[n];\r\n //input\r\n for(i=0;i<n;i++)\r\n {\r\n  printf(\"Enter the No.=\");\r\n  scanf(\"%d\",&a[i]);\r\n }\r\n //bubble sort\r\n printf(\"\\nAfter Sorting= \");\r\n for(i=0;i<n-1;i++)\r\n {\r\n  count++;\r\n   for(j=0;j<n-1;j++)\r\n   {\r\n      count++;\r\n      if(a[j]>a[j+1])\r\n      {\r\n        temp=a[j];\r\n        a[j]=a[j+1];\r\n        a[j+1]=temp;\r\n      }\r\n   }\r\n    printf(\"\\nIteration %d=\",k);\r\n    k++;\r\n    printf(\"\\n\");\r\n    for(j=0;j<n;j++)\r\n    {\r\n      printf(\"%d \",a[j]);\r\n    }\r\n    printf(\"\\nTotal Iteration = %d\",count);\r\n  }\r\n}",
    "learningSource": "//modified bubble sort\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n int i,j,n,temp=0,k=1,count=0;\r\n printf(\"Enter the Range=\");\r\n scanf(\"%d\",&n);\r\n int a[n];\r\n //input\r\n for(i=0;i<n;i++)\r\n {\r\n  printf(\"Enter the No.=\");\r\n  scanf(\"%d\",&a[i]);\r\n }\r\n //bubble sort\r\n printf(\"\\nAfter Sorting= \");\r\n for(i=0;i<n-1;i++)\r\n {\r\n  count++;\r\n   for(j=0;j<n-1;j++)\r\n   {\r\n      count++;\r\n      if(a[j]>a[j+1])\r\n      {\r\n        temp=a[j];\r\n        a[j]=a[j+1];\r\n        a[j+1]=temp;\r\n      }\r\n   }\r\n    printf(\"\\nIteration %d=\",k);\r\n    k++;\r\n    printf(\"\\n\");\r\n    for(j=0;j<n;j++)\r\n    {\r\n      printf(\"%d \",a[j]);\r\n    }\r\n    printf(\"\\nTotal Iteration = %d\",count);\r\n  }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Modified Bubble from Sorting in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Modified Bubble.",
    "tags": [
      "c",
      "sorting",
      "modified-bubble",
      "sorting algorithm",
      "comparisons",
      "swaps"
    ],
    "difficulty": "easy",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "sorting",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-136",
    "slug": "sorting-selection",
    "title": "Selection",
    "category": "sorting",
    "categoryFolder": "Sorting",
    "categoryDisplay": "Sorting & Searching",
    "originalFilename": "Selection.c",
    "originalPath": "FUNDAMENTALS OF C/Sorting/Selection.c",
    "originalSource": "//selection sort\r\n#include<stdio.h>\r\nint n, i, j, pos, swap,k=1;\r\nvoid main()\r\n{\r\n  int array[100];\r\n  printf(\"Enter number of elements\\n\");\r\n  scanf(\"%d\", &n);//n=5\r\n  printf(\"Enter %d integers\\n\", n);\r\n  //input loop\r\n  for (i = 0; i < n; i++)\r\n    scanf(\"%d\", &array[i]);\r\n    //selection\r\n  for (i = 0; i < (n - 1); i++)\r\n  {\r\n    pos = i;\r\n    for (j= i + 1; j < n; j++)\r\n    {\r\n      if (array[pos] > array[j])\r\n        pos = j;\r\n    }\r\n    \r\n      swap = array[i];\r\n      array[i] = array[pos];\r\n      array[pos] = swap;\r\n    \r\n  printf(\"After  Iteration = %d:\\n\",k);\r\n  for (j = 0; j < n; j++)\r\n    printf(\"%d \", array[j]);\r\n  printf(\"\\n\");\r\n  k++;\r\n  }\r\n}",
    "learningSource": "//selection sort\r\n#include<stdio.h>\r\nint n, i, j, pos, swap,k=1;\r\nint main(void)\r\n{\r\n  int array[100];\r\n  printf(\"Enter number of elements\\n\");\r\n  scanf(\"%d\", &n);//n=5\r\n  printf(\"Enter %d integers\\n\", n);\r\n  //input loop\r\n  for (i = 0; i < n; i++)\r\n    scanf(\"%d\", &array[i]);\r\n    //selection\r\n  for (i = 0; i < (n - 1); i++)\r\n  {\r\n    pos = i;\r\n    for (j= i + 1; j < n; j++)\r\n    {\r\n      if (array[pos] > array[j])\r\n        pos = j;\r\n    }\r\n    \r\n      swap = array[i];\r\n      array[i] = array[pos];\r\n      array[pos] = swap;\r\n    \r\n  printf(\"After  Iteration = %d:\\n\",k);\r\n  for (j = 0; j < n; j++)\r\n    printf(\"%d \", array[j]);\r\n  printf(\"\\n\");\r\n  k++;\r\n  }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Selection from Sorting in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Selection.",
    "tags": [
      "c",
      "sorting",
      "selection"
    ],
    "difficulty": "easy",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "sorting",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-137",
    "slug": "storage-class-auto",
    "title": "Auto",
    "category": "storage-class",
    "categoryFolder": "Storage class",
    "categoryDisplay": "Storage Classes & Scopes",
    "originalFilename": "Auto.c",
    "originalPath": "FUNDAMENTALS OF C/Storage class/Auto.c",
    "originalSource": "//automatic storage class\r\n#include<stdio.h>\r\nvoid main()\r\n{\r\n  auto int a;//global variable by default 1\r\n  {\r\n    printf(\"Local = %d\\n\",a);//1\r\n    a++;//2\r\n    printf(\"Local = %d\\n\",a);//2\r\n  }//outside the scope it retains 1 again\r\n  printf(\"Global = %d\\n\",a);//1\r\n  {\r\n    auto int a;//local variable//1\r\n    a++;//2\r\n    printf(\"local = %d\\n\",a);//2\r\n  }\r\n  printf(\"Global = %d\\n\",a);//1\r\n}",
    "learningSource": "//automatic storage class\r\n#include<stdio.h>\r\nint main(void)\r\n{\r\n  auto int a;//global variable by default 1\r\n  {\r\n    printf(\"Local = %d\\n\",a);//1\r\n    a++;//2\r\n    printf(\"Local = %d\\n\",a);//2\r\n  }//outside the scope it retains 1 again\r\n  printf(\"Global = %d\\n\",a);//1\r\n  {\r\n    auto int a;//local variable//1\r\n    a++;//2\r\n    printf(\"local = %d\\n\",a);//2\r\n  }\r\n  printf(\"Global = %d\\n\",a);//1\r\n\n    return 0;\n}",
    "description": "C educational implementation for Auto from Storage class in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Auto.",
    "tags": [
      "c",
      "storage-class",
      "auto",
      "scope",
      "lifetime",
      "memory"
    ],
    "difficulty": "easy",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "storage",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-138",
    "slug": "storage-class-extern",
    "title": "Extern",
    "category": "storage-class",
    "categoryFolder": "Storage class",
    "categoryDisplay": "Storage Classes & Scopes",
    "originalFilename": "extern.c",
    "originalPath": "FUNDAMENTALS OF C/Storage class/extern.c",
    "originalSource": "#include <stdio.h>\r\nextern int x;\r\nextern float y;\r\nvoid main()\r\n{\r\n    printf(\"%d\\n\", x);\r\n    x++;\r\n    printf(\"%d\\n\", x);\r\n    printf(\"%.2f\\n\", y);\r\n}\r\nint x = 10;\r\nfloat y = 5.55555;",
    "learningSource": "#include <stdio.h>\r\nextern int x;\r\nextern float y;\r\nint main(void)\r\n{\r\n    printf(\"%d\\n\", x);\r\n    x++;\r\n    printf(\"%d\\n\", x);\r\n    printf(\"%.2f\\n\", y);\r\n}\r\nint x = 10;\r\nfloat y = 5.55555;",
    "description": "C educational implementation for Extern from Storage class in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Extern.",
    "tags": [
      "c",
      "storage-class",
      "extern",
      "scope",
      "lifetime",
      "memory"
    ],
    "difficulty": "easy",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "storage",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-139",
    "slug": "storage-class-factorial-extern",
    "title": "Factorial Extern",
    "category": "storage-class",
    "categoryFolder": "Storage class",
    "categoryDisplay": "Storage Classes & Scopes",
    "originalFilename": "factorial_extern.c",
    "originalPath": "FUNDAMENTALS OF C/Storage class/factorial_extern.c",
    "originalSource": "// wap to print the factorial of a no.\r\n#include <stdio.h>\r\nextern int i;\r\nextern int f;\r\nextern int n;\r\nvoid main()\r\n{\r\n    int n;\r\n    printf(\"Enter the No.=\");\r\n    scanf(\"%d\", &n);\r\n    for (; i <= n; i++)\r\n        f = f * i;\r\n    printf(\"The Factorial of %d is %d\", n, f);\r\n}\r\nint i = 1, f = 1;\r\n",
    "learningSource": "// wap to print the factorial of a no.\r\n#include <stdio.h>\r\nextern int i;\r\nextern int f;\r\nextern int n;\r\nint main(void)\r\n{\r\n    int n;\r\n    printf(\"Enter the No.=\");\r\n    scanf(\"%d\", &n);\r\n    for (; i <= n; i++)\r\n        f = f * i;\r\n    printf(\"The Factorial of %d is %d\", n, f);\r\n}\r\nint i = 1, f = 1;\r\n",
    "description": "C educational implementation for Factorial Extern from Storage class in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Factorial Extern.",
    "tags": [
      "c",
      "storage-class",
      "factorial-extern",
      "scope",
      "lifetime",
      "memory"
    ],
    "difficulty": "easy",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "storage",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-140",
    "slug": "storage-class-register",
    "title": "Register",
    "category": "storage-class",
    "categoryFolder": "Storage class",
    "categoryDisplay": "Storage Classes & Scopes",
    "originalFilename": "register.c",
    "originalPath": "FUNDAMENTALS OF C/Storage class/register.c",
    "originalSource": "#include <stdio.h>\r\nvoid disp();\r\nint x = 20, *p; // global\r\n// p=&x;\r\nvoid main()\r\n{\r\n    register int x = 10, *p; // local\r\n    p = &x;                  // x's addresss stored within p\r\n    printf(\"The Value of X %d\\n\", x);\r\n    printf(\"The Value of X %d\\n\", *p); // 10\r\n    printf(\"The Address %u\\n\", &x);\r\n    printf(\"The Address %u\\n\", p); // x address\r\n    printf(\"The Address %u\", &p);  // p address*/\r\n    // disp();\r\n}\r\nvoid disp()\r\n{\r\n    printf(\"The Value %d\\n\", *p);\r\n    printf(\"The Address %u\\n\", p);\r\n}\r\n",
    "learningSource": "#include <stdio.h>\r\nvoid disp();\r\nint x = 20, *p; // global\r\n// p=&x;\r\nint main(void)\r\n{\r\n    register int x = 10, *p; // local\r\n    p = &x;                  // x's addresss stored within p\r\n    printf(\"The Value of X %d\\n\", x);\r\n    printf(\"The Value of X %d\\n\", *p); // 10\r\n    printf(\"The Address %u\\n\", &x);\r\n    printf(\"The Address %u\\n\", p); // x address\r\n    printf(\"The Address %u\", &p);  // p address*/\r\n    // disp();\r\n}\r\nvoid disp()\r\n{\r\n    printf(\"The Value %d\\n\", *p);\r\n    printf(\"The Address %u\\n\", p);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Register from Storage class in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Register.",
    "tags": [
      "c",
      "storage-class",
      "register"
    ],
    "difficulty": "easy",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "storage",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-141",
    "slug": "storage-class-static",
    "title": "Static",
    "category": "storage-class",
    "categoryFolder": "Storage class",
    "categoryDisplay": "Storage Classes & Scopes",
    "originalFilename": "static.c",
    "originalPath": "FUNDAMENTALS OF C/Storage class/static.c",
    "originalSource": "#include<stdio.h>\r\n#include<conio.h>\r\nvoid disp();//DECLARATION\r\nvoid main()\r\n{\r\n  disp();//CALLING\r\n //static disp();6\r\n getch();\r\n}\r\nvoid disp()//DEFINITION\r\n{\r\n  static int i;//global\r\n  {\r\n     static int i=1;//local\r\n     printf(\"Local %d\\n\",i);\r\n     i++;\r\n     printf(\"Local %d\\n\",i);\r\n  }\r\n   printf(\"Global %d\\n\",i);\r\n   i++;\r\n   printf(\"Global %d\\n\",i);\r\n}",
    "learningSource": "#include<stdio.h>\r\n#include<conio.h>\r\nvoid disp();//DECLARATION\r\nint main(void)\r\n{\r\n  disp();//CALLING\r\n //static disp();6\r\n getch();\r\n}\r\nvoid disp()//DEFINITION\r\n{\r\n  static int i;//global\r\n  {\r\n     static int i=1;//local\r\n     printf(\"Local %d\\n\",i);\r\n     i++;\r\n     printf(\"Local %d\\n\",i);\r\n  }\r\n   printf(\"Global %d\\n\",i);\r\n   i++;\r\n   printf(\"Global %d\\n\",i);\r\n\n    return 0;\n}",
    "description": "C educational implementation for Static from Storage class in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Static.",
    "tags": [
      "c",
      "storage-class",
      "static",
      "scope",
      "lifetime",
      "memory"
    ],
    "difficulty": "easy",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "storage",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-142",
    "slug": "storage-class-sum-of-n-extern",
    "title": "Sum Of N Extern",
    "category": "storage-class",
    "categoryFolder": "Storage class",
    "categoryDisplay": "Storage Classes & Scopes",
    "originalFilename": "Sum_of_n_extern.c",
    "originalPath": "FUNDAMENTALS OF C/Storage class/Sum_of_n_extern.c",
    "originalSource": "// wap to print the sum of n natural no. 1- n =sum\r\n#include <stdio.h>\r\nextern int i;\r\nextern int s;\r\nvoid main()\r\n{\r\n    int n;\r\n    printf(\"Enter the No.=\");\r\n    scanf(\"%d\", &n);\r\n    for (; i <= n; i++)\r\n    {\r\n        if (i == n)\r\n            printf(\"%d  \", i);\r\n        else\r\n            printf(\"%d + \", i);\r\n        s = s + i;\r\n    }\r\n    printf(\"= %d\", s);\r\n}\r\nint i = 1, s = 0;",
    "learningSource": "// wap to print the sum of n natural no. 1- n =sum\r\n#include <stdio.h>\r\nextern int i;\r\nextern int s;\r\nint main(void)\r\n{\r\n    int n;\r\n    printf(\"Enter the No.=\");\r\n    scanf(\"%d\", &n);\r\n    for (; i <= n; i++)\r\n    {\r\n        if (i == n)\r\n            printf(\"%d  \", i);\r\n        else\r\n            printf(\"%d + \", i);\r\n        s = s + i;\r\n    }\r\n    printf(\"= %d\", s);\r\n}\r\nint i = 1, s = 0;",
    "description": "C educational implementation for Sum Of N Extern from Storage class in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Sum Of N Extern.",
    "tags": [
      "c",
      "storage-class",
      "sum-of-n-extern",
      "total",
      "addition",
      "add",
      "scope",
      "lifetime",
      "memory"
    ],
    "difficulty": "easy",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "storage",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-143",
    "slug": "structure-employee",
    "title": "Employee",
    "category": "structure",
    "categoryFolder": "Structure",
    "categoryDisplay": "Structures (struct)",
    "originalFilename": "employee.c",
    "originalPath": "FUNDAMENTALS OF C/Structure/employee.c",
    "originalSource": "//WAP to create a Employee salary Sheet which consist of following Information\r\n//Name,id, basic salary,DA,TA,HRA,MA,gross salary,PF,Net salary,Designation\r\n/*\r\nDA=bs*5/100\r\nTA=bs*10/100\r\nHRA=bs*15/100\r\nMA=bs*10/100\r\nGS=bs+da+ta+hra+ma\r\nPF=bs*20/100\r\nnet=gs-pf\r\n*/\r\n#include<stdio.h>\r\n#include<string.h>\r\nstruct employee\r\n{\r\n    int id,bs,da,ta,hra,ma,gs,pf,ns,net;\r\n    char ds[7],nm[20];\r\n};\r\nvoid main()\r\n{\r\n    int i,n,temp;\r\n    printf(\"Enter the No of Employee = \");\r\n    scanf(\"%d\",&n);\r\n    struct employee em[n];\r\n    for(i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the %d no Employee Id no = \",i+1);\r\n        scanf(\"%d\",&em[i].id);\r\n        printf(\"Enter the %d no Employee Name = \",i+1);\r\n        scanf(\"%s\",&em[i].nm);\r\n        printf(\"Enter the %d no Employee Basic Salary = \",i+1);\r\n        scanf(\"%d\",&em[i].bs);\r\n        em[i].da=(em[i].bs*5)/100;\r\n        em[i].ta=(em[i].bs*10)/100;\r\n        em[i].hra=(em[i].bs*15)/100;\r\n        em[i].ma=(em[i].bs*10)/100;\r\n        em[i].gs=em[i].da+em[i].ta+em[i].hra+em[i].ma;\r\n        em[i].pf=(em[i].bs*20)/100;\r\n        em[i].net=em[i].gs-em[i].pf;\r\n        if(em[i].bs>=0 && em[i].bs<=10000)\r\n            strcpy(em[i].ds,\"PEON\");\r\n        else if(em[i].bs>10000 && em[i].bs<=15000)\r\n            strcpy(em[i].ds,\"CHMAN\");\r\n        else if(em[i].bs>15000 && em[i].bs<=35000)\r\n            strcpy(em[i].ds,\"EMP\");\r\n        else if(em[i].bs>35000 && em[i].bs<=60000)\r\n            strcpy(em[i].ds,\"MAN.\");\r\n        else \r\n            strcpy(em[i].ds,\"CEO\");\r\n    }\r\n    //OUTPUT\r\n    printf(\"--------------------------------------------------------------------------------------------------------------\\n\");\r\n    printf(\"ID\\tNAME\\tB.SAL\\tDA\\tTA\\tHRA\\tMA\\tG.SAL\\tPF\\tNET\\tDESIGNATION\\n\");\r\n    printf(\"--------------------------------------------------------------------------------------------------------------\\n\");\r\n    for(i=0;i<n;i++)\r\n    {\r\n        printf(\"%d\\t%s\\t%d\\t%d\\t%d\\t%d\\t%d\\t%d\\t%d\\t%d\\t%s\\n\",em[i].id,em[i].nm,em[i].bs,em[i].da,em[i].ta,em[i].hra,em[i].ma,em[i].gs,em[i].pf,em[i].net,em[i].ds);\r\n    }\r\n    printf(\"--------------------------------------------------------------------------------------------------------------\\n\");\r\n    for(i=0;i<n-1;i++)\r\n    {\r\n        if(em[i].gs<em[i+1].gs)\r\n        {\r\n                temp=em[i].gs;\r\n                em[i].gs=em[i+1].gs;\r\n                em[i+1].gs=temp;\r\n        }\r\n    }\r\n    printf(\"\\nSorted List\\n\");\r\n    printf(\"--------------------------------------------------------------------------------------------------------------\\n\");\r\n    printf(\"ID\\tNAME\\tB.SAL\\tDA\\tTA\\tHRA\\tMA\\tG.SAL\\tPF\\tNET\\tDESIGNATION\\n\");\r\n    printf(\"--------------------------------------------------------------------------------------------------------------\\n\");\r\n    for(i=0;i<n;i++)\r\n    {\r\n        printf(\"%d\\t%s\\t%d\\t%d\\t%d\\t%d\\t%d\\t%d\\t%d\\t%d\\t%s\\n\",em[i].id,em[i].nm,em[i].bs,em[i].da,em[i].ta,em[i].hra,em[i].ma,em[i].gs,em[i].pf,em[i].net,em[i].ds);\r\n    }\r\n}",
    "learningSource": "//WAP to create a Employee salary Sheet which consist of following Information\r\n//Name,id, basic salary,DA,TA,HRA,MA,gross salary,PF,Net salary,Designation\r\n/*\r\nDA=bs*5/100\r\nTA=bs*10/100\r\nHRA=bs*15/100\r\nMA=bs*10/100\r\nGS=bs+da+ta+hra+ma\r\nPF=bs*20/100\r\nnet=gs-pf\r\n*/\r\n#include<stdio.h>\r\n#include<string.h>\r\nstruct employee\r\n{\r\n    int id,bs,da,ta,hra,ma,gs,pf,ns,net;\r\n    char ds[7],nm[20];\r\n};\r\nint main(void)\r\n{\r\n    int i,n,temp;\r\n    printf(\"Enter the No of Employee = \");\r\n    scanf(\"%d\",&n);\r\n    struct employee em[n];\r\n    for(i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the %d no Employee Id no = \",i+1);\r\n        scanf(\"%d\",&em[i].id);\r\n        printf(\"Enter the %d no Employee Name = \",i+1);\r\n        scanf(\"%s\",&em[i].nm);\r\n        printf(\"Enter the %d no Employee Basic Salary = \",i+1);\r\n        scanf(\"%d\",&em[i].bs);\r\n        em[i].da=(em[i].bs*5)/100;\r\n        em[i].ta=(em[i].bs*10)/100;\r\n        em[i].hra=(em[i].bs*15)/100;\r\n        em[i].ma=(em[i].bs*10)/100;\r\n        em[i].gs=em[i].da+em[i].ta+em[i].hra+em[i].ma;\r\n        em[i].pf=(em[i].bs*20)/100;\r\n        em[i].net=em[i].gs-em[i].pf;\r\n        if(em[i].bs>=0 && em[i].bs<=10000)\r\n            strcpy(em[i].ds,\"PEON\");\r\n        else if(em[i].bs>10000 && em[i].bs<=15000)\r\n            strcpy(em[i].ds,\"CHMAN\");\r\n        else if(em[i].bs>15000 && em[i].bs<=35000)\r\n            strcpy(em[i].ds,\"EMP\");\r\n        else if(em[i].bs>35000 && em[i].bs<=60000)\r\n            strcpy(em[i].ds,\"MAN.\");\r\n        else \r\n            strcpy(em[i].ds,\"CEO\");\r\n    }\r\n    //OUTPUT\r\n    printf(\"--------------------------------------------------------------------------------------------------------------\\n\");\r\n    printf(\"ID\\tNAME\\tB.SAL\\tDA\\tTA\\tHRA\\tMA\\tG.SAL\\tPF\\tNET\\tDESIGNATION\\n\");\r\n    printf(\"--------------------------------------------------------------------------------------------------------------\\n\");\r\n    for(i=0;i<n;i++)\r\n    {\r\n        printf(\"%d\\t%s\\t%d\\t%d\\t%d\\t%d\\t%d\\t%d\\t%d\\t%d\\t%s\\n\",em[i].id,em[i].nm,em[i].bs,em[i].da,em[i].ta,em[i].hra,em[i].ma,em[i].gs,em[i].pf,em[i].net,em[i].ds);\r\n    }\r\n    printf(\"--------------------------------------------------------------------------------------------------------------\\n\");\r\n    for(i=0;i<n-1;i++)\r\n    {\r\n        if(em[i].gs<em[i+1].gs)\r\n        {\r\n                temp=em[i].gs;\r\n                em[i].gs=em[i+1].gs;\r\n                em[i+1].gs=temp;\r\n        }\r\n    }\r\n    printf(\"\\nSorted List\\n\");\r\n    printf(\"--------------------------------------------------------------------------------------------------------------\\n\");\r\n    printf(\"ID\\tNAME\\tB.SAL\\tDA\\tTA\\tHRA\\tMA\\tG.SAL\\tPF\\tNET\\tDESIGNATION\\n\");\r\n    printf(\"--------------------------------------------------------------------------------------------------------------\\n\");\r\n    for(i=0;i<n;i++)\r\n    {\r\n        printf(\"%d\\t%s\\t%d\\t%d\\t%d\\t%d\\t%d\\t%d\\t%d\\t%d\\t%s\\n\",em[i].id,em[i].nm,em[i].bs,em[i].da,em[i].ta,em[i].hra,em[i].ma,em[i].gs,em[i].pf,em[i].net,em[i].ds);\r\n    }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Employee from Structure in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Employee.",
    "tags": [
      "c",
      "structure",
      "employee",
      "struct",
      "record"
    ],
    "difficulty": "medium",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "structure",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-144",
    "slug": "structure-search-namewise",
    "title": "Search Namewise",
    "category": "structure",
    "categoryFolder": "Structure",
    "categoryDisplay": "Structures (struct)",
    "originalFilename": "search-namewise.c",
    "originalPath": "FUNDAMENTALS OF C/Structure/search-namewise.c",
    "originalSource": "//WAP to create a student structure of n no. of student & search a student record name wise\r\n#include<stdio.h>\r\n#include<string.h>\r\nstruct student\r\n{\r\n   int roll_no,C,DE,BE,t,avg;\r\n   char nm[20],grd;\r\n};\r\nvoid main()\r\n{\r\n  int i,n,f,k=0;\r\n  char name[20];\r\n  printf(\"Enter the No. of Student = \");\r\n  scanf(\"%d\",&n);\r\n  struct student s[n];\r\n  //input\r\n  for(i=0;i<n;i++)\r\n  {\r\n    printf(\"Enter the Roll No. = \");\r\n    scanf(\"%d\",&s[i].roll_no);\r\n    printf(\"Enter the Name = \");\r\n    scanf(\"%s\",&s[i].nm);\r\n    printf(\"Enter the C marks = \");\r\n    scanf(\"%d\",&s[i].C);\r\n    printf(\"Enter the DE marks = \");\r\n    scanf(\"%d\",&s[i].DE);\r\n    printf(\"Enter the BE marks = \");\r\n    scanf(\"%d\",&s[i].BE);\r\n    s[i].t=s[i].C+s[i].DE+s[i].BE;\r\n    s[i].avg=s[i].t/3;\r\n    if(s[i].avg>=0 && s[i].avg<=40)\r\n       s[i].grd='D';\r\n    else if(s[i].avg>40 && s[i].avg<=60)\r\n       s[i].grd='C';\r\n    else if(s[i].avg>60 && s[i].avg<=80)\r\n       s[i].grd='B';\r\n    else if(s[i].avg>80 && s[i].avg<=90)\r\n       s[i].grd='A';\r\n    else\r\n       s[i].grd='O';\r\n  }\r\n  //output\r\n  printf(\"--------------------------------------------------------------------------------\\n\");\r\n  printf(\"Roll\\tName\\tC\\tDE\\tBE\\tTotal\\tAvg\\tGrade\\n\");\r\n  printf(\"--------------------------------------------------------------------------------\\n\");\r\n  for(i=0;i<n;i++)\r\n  {\r\n    printf(\"%d\\t%s\\t%d\\t%d\\t%d\\t%d\\t%d\\t%c\\n\",s[i].roll_no,s[i].nm,s[i].C,s[i].DE,s[i].BE,s[i].t,s[i].avg,s[i].grd);\r\n  }\r\n  printf(\"Enter the Name you want to search = \");\r\n  scanf(\"%s\",&name);\r\n  for(i=0;i<n;i++)\r\n  {\r\n    f=strcmpi(s[i].nm,name);\r\n    if(f==0)\r\n      {\r\n       printf(\"--------------------------------------------------------------------------------\\n\");\r\n       printf(\"Roll\\tName\\tC\\tDE\\tBE\\tTotal\\tAvg\\tGrade\\n\");\r\n       printf(\"--------------------------------------------------------------------------------\\n\");\r\n       printf(\"%d\\t%s\\t%d\\t%d\\t%d\\t%d\\t%d\\t%c\\n\",s[i].roll_no,s[i].nm,s[i].C,s[i].DE,s[i].BE,s[i].t,s[i].avg,s[i].grd);\r\n       k++;\r\n      }\r\n  }\r\n  if(k==0)\r\n    printf(\"Record Not Found\");\r\n}",
    "learningSource": "//WAP to create a student structure of n no. of student & search a student record name wise\r\n#include<stdio.h>\r\n#include<string.h>\r\nstruct student\r\n{\r\n   int roll_no,C,DE,BE,t,avg;\r\n   char nm[20],grd;\r\n};\r\nint main(void)\r\n{\r\n  int i,n,f,k=0;\r\n  char name[20];\r\n  printf(\"Enter the No. of Student = \");\r\n  scanf(\"%d\",&n);\r\n  struct student s[n];\r\n  //input\r\n  for(i=0;i<n;i++)\r\n  {\r\n    printf(\"Enter the Roll No. = \");\r\n    scanf(\"%d\",&s[i].roll_no);\r\n    printf(\"Enter the Name = \");\r\n    scanf(\"%s\",&s[i].nm);\r\n    printf(\"Enter the C marks = \");\r\n    scanf(\"%d\",&s[i].C);\r\n    printf(\"Enter the DE marks = \");\r\n    scanf(\"%d\",&s[i].DE);\r\n    printf(\"Enter the BE marks = \");\r\n    scanf(\"%d\",&s[i].BE);\r\n    s[i].t=s[i].C+s[i].DE+s[i].BE;\r\n    s[i].avg=s[i].t/3;\r\n    if(s[i].avg>=0 && s[i].avg<=40)\r\n       s[i].grd='D';\r\n    else if(s[i].avg>40 && s[i].avg<=60)\r\n       s[i].grd='C';\r\n    else if(s[i].avg>60 && s[i].avg<=80)\r\n       s[i].grd='B';\r\n    else if(s[i].avg>80 && s[i].avg<=90)\r\n       s[i].grd='A';\r\n    else\r\n       s[i].grd='O';\r\n  }\r\n  //output\r\n  printf(\"--------------------------------------------------------------------------------\\n\");\r\n  printf(\"Roll\\tName\\tC\\tDE\\tBE\\tTotal\\tAvg\\tGrade\\n\");\r\n  printf(\"--------------------------------------------------------------------------------\\n\");\r\n  for(i=0;i<n;i++)\r\n  {\r\n    printf(\"%d\\t%s\\t%d\\t%d\\t%d\\t%d\\t%d\\t%c\\n\",s[i].roll_no,s[i].nm,s[i].C,s[i].DE,s[i].BE,s[i].t,s[i].avg,s[i].grd);\r\n  }\r\n  printf(\"Enter the Name you want to search = \");\r\n  scanf(\"%s\",&name);\r\n  for(i=0;i<n;i++)\r\n  {\r\n    f=strcmpi(s[i].nm,name);\r\n    if(f==0)\r\n      {\r\n       printf(\"--------------------------------------------------------------------------------\\n\");\r\n       printf(\"Roll\\tName\\tC\\tDE\\tBE\\tTotal\\tAvg\\tGrade\\n\");\r\n       printf(\"--------------------------------------------------------------------------------\\n\");\r\n       printf(\"%d\\t%s\\t%d\\t%d\\t%d\\t%d\\t%d\\t%c\\n\",s[i].roll_no,s[i].nm,s[i].C,s[i].DE,s[i].BE,s[i].t,s[i].avg,s[i].grd);\r\n       k++;\r\n      }\r\n  }\r\n  if(k==0)\r\n    printf(\"Record Not Found\");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Search Namewise from Structure in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Search Namewise.",
    "tags": [
      "c",
      "structure",
      "search-namewise",
      "binary search",
      "linear search",
      "find"
    ],
    "difficulty": "medium",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "structure",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-145",
    "slug": "structure-search-student-rollwise",
    "title": "Search Student Rollwise",
    "category": "structure",
    "categoryFolder": "Structure",
    "categoryDisplay": "Structures (struct)",
    "originalFilename": "search_student-rollwise.c",
    "originalPath": "FUNDAMENTALS OF C/Structure/search_student-rollwise.c",
    "originalSource": "//WAP to create a student structure of n no. of student & search a student record roll no. wise\r\n#include<stdio.h>\r\nstruct student\r\n{\r\n   int roll_no,C,DE,BE,t,avg;\r\n   char nm[20],grd;\r\n};\r\nvoid main()\r\n{\r\n  int i,n,r,f=0;\r\n  printf(\"Enter the No. of Student = \");\r\n  scanf(\"%d\",&n);\r\n  struct student s[n];\r\n  //input\r\n  for(i=0;i<n;i++)\r\n  {\r\n    printf(\"Enter the Roll No. = \");\r\n    scanf(\"%d\",&s[i].roll_no);\r\n    printf(\"Enter the Name = \");\r\n    scanf(\"%s\",&s[i].nm);\r\n    printf(\"Enter the C marks = \");\r\n    scanf(\"%d\",&s[i].C);\r\n    printf(\"Enter the DE marks = \");\r\n    scanf(\"%d\",&s[i].DE);\r\n    printf(\"Enter the BE marks = \");\r\n    scanf(\"%d\",&s[i].BE);\r\n    s[i].t=s[i].C+s[i].DE+s[i].BE;\r\n    s[i].avg=s[i].t/3;\r\n    if(s[i].avg>=0 && s[i].avg<=40)\r\n       s[i].grd='D';\r\n    else if(s[i].avg>40 && s[i].avg<=60)\r\n       s[i].grd='C';\r\n    else if(s[i].avg>60 && s[i].avg<=80)\r\n       s[i].grd='B';\r\n    else if(s[i].avg>80 && s[i].avg<=90)\r\n       s[i].grd='A';\r\n    else\r\n       s[i].grd='O';\r\n  }\r\n  //output\r\n  printf(\"--------------------------------------------------------------------------------\\n\");\r\n  printf(\"Roll\\tName\\tC\\tDE\\tBE\\tTotal\\tAvg\\tGrade\\n\");\r\n  printf(\"--------------------------------------------------------------------------------\\n\");\r\n  for(i=0;i<n;i++)\r\n  {\r\n    printf(\"%d\\t%s\\t%d\\t%d\\t%d\\t%d\\t%d\\t%c\\n\",s[i].roll_no,s[i].nm,s[i].C,s[i].DE,s[i].BE,s[i].t,s[i].avg,s[i].grd);\r\n  }\r\n  printf(\"Enter the Roll No. you want to search for = \");\r\n  scanf(\"%d\",&r);\r\n  for(i=0;i<n;i++)\r\n  {\r\n    if(s[i].roll_no==r)\r\n      {\r\n       printf(\"--------------------------------------------------------------------------------\\n\");\r\n       printf(\"Roll\\tName\\tC\\tDE\\tBE\\tTotal\\tAvg\\tGrade\\n\");\r\n       printf(\"--------------------------------------------------------------------------------\\n\");\r\n       printf(\"%d\\t%s\\t%d\\t%d\\t%d\\t%d\\t%d\\t%c\\n\",s[i].roll_no,s[i].nm,s[i].C,s[i].DE,s[i].BE,s[i].t,s[i].avg,s[i].grd);\r\n       f=1;\r\n       break;\r\n      }\r\n  }\r\n  if(f==0)\r\n    printf(\"Record Not Found\");\r\n}",
    "learningSource": "//WAP to create a student structure of n no. of student & search a student record roll no. wise\r\n#include<stdio.h>\r\nstruct student\r\n{\r\n   int roll_no,C,DE,BE,t,avg;\r\n   char nm[20],grd;\r\n};\r\nint main(void)\r\n{\r\n  int i,n,r,f=0;\r\n  printf(\"Enter the No. of Student = \");\r\n  scanf(\"%d\",&n);\r\n  struct student s[n];\r\n  //input\r\n  for(i=0;i<n;i++)\r\n  {\r\n    printf(\"Enter the Roll No. = \");\r\n    scanf(\"%d\",&s[i].roll_no);\r\n    printf(\"Enter the Name = \");\r\n    scanf(\"%s\",&s[i].nm);\r\n    printf(\"Enter the C marks = \");\r\n    scanf(\"%d\",&s[i].C);\r\n    printf(\"Enter the DE marks = \");\r\n    scanf(\"%d\",&s[i].DE);\r\n    printf(\"Enter the BE marks = \");\r\n    scanf(\"%d\",&s[i].BE);\r\n    s[i].t=s[i].C+s[i].DE+s[i].BE;\r\n    s[i].avg=s[i].t/3;\r\n    if(s[i].avg>=0 && s[i].avg<=40)\r\n       s[i].grd='D';\r\n    else if(s[i].avg>40 && s[i].avg<=60)\r\n       s[i].grd='C';\r\n    else if(s[i].avg>60 && s[i].avg<=80)\r\n       s[i].grd='B';\r\n    else if(s[i].avg>80 && s[i].avg<=90)\r\n       s[i].grd='A';\r\n    else\r\n       s[i].grd='O';\r\n  }\r\n  //output\r\n  printf(\"--------------------------------------------------------------------------------\\n\");\r\n  printf(\"Roll\\tName\\tC\\tDE\\tBE\\tTotal\\tAvg\\tGrade\\n\");\r\n  printf(\"--------------------------------------------------------------------------------\\n\");\r\n  for(i=0;i<n;i++)\r\n  {\r\n    printf(\"%d\\t%s\\t%d\\t%d\\t%d\\t%d\\t%d\\t%c\\n\",s[i].roll_no,s[i].nm,s[i].C,s[i].DE,s[i].BE,s[i].t,s[i].avg,s[i].grd);\r\n  }\r\n  printf(\"Enter the Roll No. you want to search for = \");\r\n  scanf(\"%d\",&r);\r\n  for(i=0;i<n;i++)\r\n  {\r\n    if(s[i].roll_no==r)\r\n      {\r\n       printf(\"--------------------------------------------------------------------------------\\n\");\r\n       printf(\"Roll\\tName\\tC\\tDE\\tBE\\tTotal\\tAvg\\tGrade\\n\");\r\n       printf(\"--------------------------------------------------------------------------------\\n\");\r\n       printf(\"%d\\t%s\\t%d\\t%d\\t%d\\t%d\\t%d\\t%c\\n\",s[i].roll_no,s[i].nm,s[i].C,s[i].DE,s[i].BE,s[i].t,s[i].avg,s[i].grd);\r\n       f=1;\r\n       break;\r\n      }\r\n  }\r\n  if(f==0)\r\n    printf(\"Record Not Found\");\r\n\n    return 0;\n}",
    "description": "C educational implementation for Search Student Rollwise from Structure in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Search Student Rollwise.",
    "tags": [
      "c",
      "structure",
      "search-student-rollwise",
      "binary search",
      "linear search",
      "find",
      "struct",
      "record"
    ],
    "difficulty": "medium",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "structure",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  },
  {
    "id": "c-lesson-146",
    "slug": "structure-student",
    "title": "Student",
    "category": "structure",
    "categoryFolder": "Structure",
    "categoryDisplay": "Structures (struct)",
    "originalFilename": "Student.c",
    "originalPath": "FUNDAMENTALS OF C/Structure/Student.c",
    "originalSource": "//WAP to Create a Student Structure of n no of student\r\n#include<stdio.h>\r\nstruct student\r\n{\r\n    int roll_no,c,ph,mt,dr,t,avg;\r\n    char nm[20],grd;//ASMITA\r\n};\r\nvoid main()\r\n{\r\n    int i,n;\r\n    printf(\"Enter the No of Student = \");\r\n    scanf(\"%d\",&n);\r\n    struct student s[n];\r\n    //input\r\n    for(i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the Roll no for %d no Student = \",i+1);\r\n        scanf(\"%d\",&s[i].roll_no);\r\n        printf(\"Enter the NAME for %d no Student = \",i+1);\r\n        scanf(\"%19[^\\n]\", s[i].nm);\r\n        printf(\"Enter the C no for %d no Student = \",i+1);\r\n        scanf(\"%d\",&s[i].c);\r\n        printf(\"Enter the Physics no for %d no Student = \",i+1);\r\n        scanf(\"%d\",&s[i].ph);\r\n        printf(\"Enter the Math no for %d no Student = \",i+1);\r\n        scanf(\"%d\",&s[i].mt);\r\n        printf(\"Enter the Engineering Drawing no for %d no Student = \",i+1);\r\n        scanf(\"%d\",&s[i].dr);\r\n        s[i].t=(s[i].c+s[i].mt+s[i].ph+s[i].dr);\r\n        s[i].avg=(s[i].c+s[i].mt+s[i].ph+s[i].dr)/4;\r\n        if(s[i].avg>=0 && s[i].avg<=40)\r\n            s[i].grd='D';\r\n        else if(s[i].avg>40 && s[i].avg<=60)\r\n            s[i].grd='C';\r\n        else if(s[i].avg>60 && s[i].avg<=80)\r\n            s[i].grd='B';\r\n        else if(s[i].avg>80 && s[i].avg<=90)\r\n            s[i].grd='A';\r\n        else\r\n            s[i].grd='O';\r\n    }\r\n    //output\r\n    printf(\"--------------------------------------------------------------------------------\\n\");\r\n    printf(\"Roll\\tName\\tC\\tPhysics\\tMath\\tDrawing\\tTotal\\tAvg\\tGrade\\n\");\r\n    printf(\"--------------------------------------------------------------------------------\\n\");\r\n    for(i=0;i<n;i++)\r\n  {\r\n    printf(\"%d\\t%s\\t%d\\t%d\\t%d\\t%d\\t%d\\t%d\\t%c\\n\",s[i].roll_no,s[i].nm,s[i].c,s[i].ph,s[i].mt,s[i].dr,s[i].t,s[i].avg,s[i].grd);\r\n  }\r\n}\r\n",
    "learningSource": "//WAP to Create a Student Structure of n no of student\r\n#include<stdio.h>\r\nstruct student\r\n{\r\n    int roll_no,c,ph,mt,dr,t,avg;\r\n    char nm[20],grd;//ASMITA\r\n};\r\nint main(void)\r\n{\r\n    int i,n;\r\n    printf(\"Enter the No of Student = \");\r\n    scanf(\"%d\",&n);\r\n    struct student s[n];\r\n    //input\r\n    for(i=0;i<n;i++)\r\n    {\r\n        printf(\"Enter the Roll no for %d no Student = \",i+1);\r\n        scanf(\"%d\",&s[i].roll_no);\r\n        printf(\"Enter the NAME for %d no Student = \",i+1);\r\n        scanf(\"%19[^\\n]\", s[i].nm);\r\n        printf(\"Enter the C no for %d no Student = \",i+1);\r\n        scanf(\"%d\",&s[i].c);\r\n        printf(\"Enter the Physics no for %d no Student = \",i+1);\r\n        scanf(\"%d\",&s[i].ph);\r\n        printf(\"Enter the Math no for %d no Student = \",i+1);\r\n        scanf(\"%d\",&s[i].mt);\r\n        printf(\"Enter the Engineering Drawing no for %d no Student = \",i+1);\r\n        scanf(\"%d\",&s[i].dr);\r\n        s[i].t=(s[i].c+s[i].mt+s[i].ph+s[i].dr);\r\n        s[i].avg=(s[i].c+s[i].mt+s[i].ph+s[i].dr)/4;\r\n        if(s[i].avg>=0 && s[i].avg<=40)\r\n            s[i].grd='D';\r\n        else if(s[i].avg>40 && s[i].avg<=60)\r\n            s[i].grd='C';\r\n        else if(s[i].avg>60 && s[i].avg<=80)\r\n            s[i].grd='B';\r\n        else if(s[i].avg>80 && s[i].avg<=90)\r\n            s[i].grd='A';\r\n        else\r\n            s[i].grd='O';\r\n    }\r\n    //output\r\n    printf(\"--------------------------------------------------------------------------------\\n\");\r\n    printf(\"Roll\\tName\\tC\\tPhysics\\tMath\\tDrawing\\tTotal\\tAvg\\tGrade\\n\");\r\n    printf(\"--------------------------------------------------------------------------------\\n\");\r\n    for(i=0;i<n;i++)\r\n  {\r\n    printf(\"%d\\t%s\\t%d\\t%d\\t%d\\t%d\\t%d\\t%d\\t%c\\n\",s[i].roll_no,s[i].nm,s[i].c,s[i].ph,s[i].mt,s[i].dr,s[i].t,s[i].avg,s[i].grd);\r\n  }\r\n\n    return 0;\n}",
    "description": "C educational implementation for Student from Structure in Fundamentals of C.",
    "conceptSummary": "Learn line-by-line execution, memory allocation, and data flow for Student.",
    "tags": [
      "c",
      "structure",
      "student",
      "struct",
      "record"
    ],
    "difficulty": "medium",
    "defaultInput": "10 20",
    "presets": [
      {
        "label": "Default Input",
        "value": "10 20",
        "description": "Standard demonstration input"
      }
    ],
    "renderer": "structure",
    "lineMap": {
      "INIT": 4,
      "READ_INPUT": 6,
      "COMPUTE": 8,
      "COMPLETE": 10
    }
  }
]
  .map((lesson: any) => {
    return {
      ...lesson,
      generateTrace: (input: string) => {
        const inp = input || lesson.defaultInput;
        switch (lesson.renderer) {
          case 'variables':
            return generateBasicsTrace(lesson.title, inp);
          case 'condition':
            return generateConditionTrace(lesson.title, inp);
          case 'number':
            return generateNumberTrace(lesson.title, inp);
          case 'pattern':
            return generatePatternTrace(lesson.title, inp);
          case 'array':
          case 'sorting':
          case 'search':
            return generateArrayTrace(lesson.title, inp);
          case 'matrix':
            return generateMatrixTrace(lesson.title, inp);
          case 'string':
            return generateStringTrace(lesson.title, inp);
          default:
            return generateBasicsTrace(lesson.title, inp);
        }
      }
    };
  });

export function getCLessonBySlug(slug: string): CProgramLesson | undefined {
  const clean = (slug || '').toLowerCase().trim();
  return ALL_C_LESSONS.find((l) => l.slug === clean || l.id === clean || l.originalFilename.toLowerCase() === clean);
}

export function searchCLessons(query: string, categoryId: string = 'all'): CProgramLesson[] {
  const q = (query || '').toLowerCase().trim();

  return ALL_C_LESSONS.filter((lesson) => {
    if (categoryId !== 'all' && lesson.category !== categoryId) return false;
    if (!q) return true;

    return (
      lesson.title.toLowerCase().includes(q) ||
      lesson.originalFilename.toLowerCase().includes(q) ||
      lesson.categoryDisplay.toLowerCase().includes(q) ||
      lesson.description.toLowerCase().includes(q) ||
      lesson.tags.some((t: string) => t.toLowerCase().includes(q))
    );
  });
}
