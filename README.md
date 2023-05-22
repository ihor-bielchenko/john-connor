SELECT 
	`state_item`.`id` AS `stateItemId`,
    `state_item`.`stateId` AS `stateItemStateId`,
    `state_item`.`neuronId` AS `stateItemNeuronId`,
    `state_item`.`order` AS `stateItemOrder`,
    `chain`.`id` AS `chainId`,
    `chain`.`parentId` AS `chainParentId`,
    `chain`.`neuronId` AS `chainNeuronId`,
    `chain`.`stateId` AS `chainStateId`,
    `chain`.`dataId` AS `chainDataId`,
    `chain`.`isTrue` AS `chainIsTrue`,
    `chain`.`isFortified` AS `chainIsFortified`,
    `data`.`id` AS `dataId`,
    `data`.`value` AS `dataValue`
FROM `state_item`
LEFT JOIN `chain`
ON `state_item`.`stateId` = `chain`.`stateId`
LEFT JOIN `data`
ON `chain`.`dataId` = `data`.`id`
WHERE 
	`state_item`.`stateId` != "1"
	AND
	`state_item`.`neuronId` IN (2,3,1)
	AND
	`state_item`.`order` IN (0,1,2)
GROUP BY 
	`state_item`.`order`, 
	`state_item`.`neuronId`
ORDER BY 
	`state_item`.`order` ASC,
	`state_item`.`neuronId` ASC;