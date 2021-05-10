/*******************************************************
 * Using this service to creat props for Chip components
 ********************************************************/

exports.generateChip = function (name, type, isActive) {
	try {
		if (!name)
			return new Error("Missing name")
		if (!type)
			return new Error("Missing type")

		return {
			name,
			type,
			isActive: isActive || false,
			set setIsActive(newState) {
				return this.isActive = newState
			},
			get getIsActive() {
				return this.isActive
			}
		}

	} catch (err) {
		console.error(err)
	}
}
