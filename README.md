SELECT
	`chain_item`.`id` AS `chainItemId`,
	`chain_item`.`chainId` AS `chainId`,
	`chain_item`.`neuronId` AS `chainItemNeuronId`,
	`chain_item`.`order` AS `order`,
	`chain`.`neuronId` AS `chainNeuronId`,
	`chain`.`dataId` AS `dataId`,
    `data`.`value` AS `value`
FROM `chain_item`
LEFT JOIN `chain`
ON `chainId` = `chain`.`id`
LEFT JOIN `data`
ON `chain`.`dataId` = `data`.`id`
WHERE
	`data`.`value` = ""
    AND 
	((`chain_item`.`neuronId` = 1 AND `chain_item`.`order` = 0)
        OR
        (`chain_item`.`neuronId` = 2 AND `chain_item`.`order` = 1))
GROUP BY `chainItemNeuronId`
ORDER BY `chainItemNeuronId`;

SELECT `id`, `userId`, `fieldId`, `contentId`, `value`, `createdAt`, `updatedAt`, COUNT(`value`) as `length` FROM `field_content` WHERE `fieldId` = "happ-forms-field-skill-name" GROUP BY `value` HAVING `length` = 1 ORDER BY `createdAt` DESC LIMIT 1,3;