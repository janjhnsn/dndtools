module.exports = {
    addSqlParam: (sql, params) => {
        var extraSql = '';
        if (params.id) {
            extraSql = addAndToSql(extraSql);
            extraSql += " guid = " + params.id;
        }

        if (params.rulebook) {
            extraSql = addAndToSql(extraSql);
            extraSql += " rulebook = " + params.rulebook;
        }

        if (params.school) {
            extraSql = addAndToSql(extraSql);
            extraSql += " school = " + params.school;
        }

        if (params.subschool) {
            extraSql = addAndToSql(extraSql);
            extraSql += " subschool = " + params.subschool;
        }

        if (params.limit) {
            extraSql += " LIMIT " + params.limit;
        }
        console.log('SQL: ', sql + extraSql);
        return sql + extraSql;
    },

    getSqlParams: (req) => {
        return {
            id: req.query.id,
            limit: req.query.limit,
            rulebook: req.query.rulebook,
            school: req.query.school,
            subschool: req.query.subschool
        }
    },

    addAndToSql: (sql) => {
        if (sql.indexOf("WHERE") != -1) {
            sql += " AND";
        } else {
            sql += " WHERE";
        }

        return sql;
    }
}