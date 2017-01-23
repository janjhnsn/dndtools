module.exports = {
    addSqlParam: (sql, params) => {
        var extraSql = '';
        if (params.id) {
            extraSql = addAndToSql(extraSql);
            extraSql += " guid = " + params.id;
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
            slug: req.query.slug,
            limit: req.query.limit
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