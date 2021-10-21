# Migration Tool

## about

Base on db-migrate (https://github.com/db-migrate/node-db-migrate). <br />
Use from package.json script `db-migrate`.<br />
The script get parameters and create, run up or run down the migration.<br />
script is warp `node_modules/db-migrate/bin/db-migrate` command.<br />

## concept (TLDR;)
Each migrate step is created with run `new` command. <br />
The `new` generate step skeleton on `PROJECT_HOME/migrations/commits` folder.<br />
After generate step skeleton developer should implement the code in "up"/"Down" function. <br />
Migration step are run with "up" command. <br />


##Commands
`npm run db-migrate:<env> up` running all pending migrations.<br/>
`npm run db-migrate:<env> new -n {item_name}` create a new migration step with {item_name} <br/>
`npm run db-migrate:<env> down -- -l` Run Down 1 migrate (rollback). Each migration step that may support "down" function (rollback) .
`npm run db-migrate:<env> down -- -a` Run Down all migration steps.

