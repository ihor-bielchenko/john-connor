
const queryRunnerManager = (value) => {
	return value
		&& value.constructor.name === 'EntityManager'
		&& value['queryRunner'].constructor.name === 'MysqlQueryRunner';
};

export default queryRunnerManager;
