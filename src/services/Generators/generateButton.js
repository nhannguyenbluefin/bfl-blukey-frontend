/*********************************************************
 * Using this service to create props for Button component
 * ********************************************************/

exports.generateButton = function (name = 'Button', type = 'text', style = 'solid', size = '', icon = '',) {
	try {
		return {
			name,
			type,
			style,
			size,
			icon,
		}
	} catch (err) {
		console.error(err)
	}
}
