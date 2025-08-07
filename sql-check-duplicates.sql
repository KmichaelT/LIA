-- SQL queries to check for duplicates in children table
-- Adjust table name based on your Strapi setup (might be 'children' or similar)

-- 1. Find duplicate names (first + last name combination)
SELECT 
    first_name, 
    last_name, 
    COUNT(*) as count
FROM children 
WHERE first_name IS NOT NULL 
    AND last_name IS NOT NULL
GROUP BY first_name, last_name 
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- 2. Show all details for duplicate entries
SELECT 
    c1.id,
    c1.first_name,
    c1.last_name,
    c1.created_at
FROM children c1
INNER JOIN (
    SELECT first_name, last_name
    FROM children
    GROUP BY first_name, last_name
    HAVING COUNT(*) > 1
) c2 ON c1.first_name = c2.first_name 
    AND c1.last_name = c2.last_name
ORDER BY c1.first_name, c1.last_name, c1.created_at;

-- 3. Find potential duplicates by similar names (fuzzy matching)
-- This requires specific database features, example for PostgreSQL:
-- SELECT * FROM children WHERE soundex(first_name) = soundex('target_name');