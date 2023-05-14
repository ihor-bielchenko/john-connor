import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const sqlConfig = () => {
	const configArr: Array<any> =  Object.keys(process.env || {})
		.filter((key) => [ 'SQL_SLAVE', '_HOST' ].filter((item) => key.includes(item)).length === [ 'SQL_SLAVE', '_HOST' ].length)
		.map((key) => {
			[ 'SQL_SLAVE', '_HOST' ].forEach((item) => (key = key.replace(item, '')));

			return {
				host: process.env[`SQL_SLAVE${key}_HOST`],
				port: Number(process.env[`SQL_SLAVE${key}_PORT`]),
				username: process.env[`SQL_SLAVE${key}_USER`],
				password: process.env[`SQL_SLAVE${key}_USER_PASSWORD`],
				database: process.env[`SQL_SLAVE${key}_DATABASE`],
			};
		});
	const output: TypeOrmModuleOptions = {
		type: 'mysql',
		...(configArr.length > 0)
			? {
				replication: {
					master: {
						host: process.env.SQL_MASTER_HOST,
						port: Number(process.env.SQL_MASTER_PORT),
						username: process.env.SQL_MASTER_USER,
						password: process.env.SQL_MASTER_USER_PASSWORD,
						database: process.env.SQL_MASTER_DATABASE,
					},
					slaves: [ ...configArr ],
				},
			}
			: {
				host: process.env.SQL_HOST || process.env.SQL_MASTER_HOST,
				port: Number(process.env.SQL_PORT || process.env.SQL_MASTER_PORT),
				username: process.env.SQL_USER || process.env.SQL_MASTER_USER,
				password: process.env.SQL_USER_PASSWORD || process.env.SQL_MASTER_USER_PASSWORD,
				database: process.env.SQL_DATABASE || process.env.SQL_MASTER_DATABASE,
			},
		autoLoadEntities: true,
		synchronize: true,
	};

	return output;
};

export default sqlConfig;
