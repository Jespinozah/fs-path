SELECT * FROM PETS;
SELECT NAME FROM PETS;
SELECT TYPE FROM PETS;
SELECT P.NAME FROM PETS P;
SELECT NAME || ' IS A ' || TYPE AS DESCRIPTION FROM PETS;
SELECT * FROM PETS ORDER BY ID DESC ;
SELECT * FROM PETS ORDER BY NAME DESC;
SELECT * FROM PETS ORDER BY NAME NULLS LAST;
SELECT DISTINCT TYPE FROM PETS ORDER BY TYPE DESC;
SELECT * FROM PETS P WHERE P.TYPE = 'Cat';
SELECT * FROM PETS P WHERE P.TYPE = 'Cat' and P.NAME IS NOT NULL;
SELECT FALSE AND FALSE AS RESULT;
SELECT FALSE AND TRUE AS RESULT;
SELECT FALSE OR TRUE AS RESULT;
SELECT FALSE OR FALSE AS RESULT;
SELECT 1>1 AS RESULT;
SELECT * FROM PETS LIMIT 2;
SELECT * FROM PETS P WHERE P.ID IN (1,3,5);

