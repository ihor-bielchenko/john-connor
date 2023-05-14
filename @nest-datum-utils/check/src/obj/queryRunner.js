
const queryRunner = (value) => {
	return value
		&& value.constructor.name === 'MysqlQueryRunner';
};

export default queryRunner;
