export const isValidDate = (value) => {
	if (!value) return false;
	const date = new Date(value);
	return !isNaN(date.getTime());
};

export const isValidImageURL = (value) => {
	if (!value) return false;
	return /^https?:\/\/.+\.(jpg|jpeg|png)$/i.test(value);
};

export const isString = (value) => {
	return typeof value === "string" && value.length > 0 && !/\d/.test(value);
};

const requiredFields = [
	"date",
	"image",
	"signature_name",
	"student_name",
	"subject",
];

export const isPrototypeSpecificTemplate = (templateFormData) => {
	const templateFields = Object.keys(templateFormData);
	return (
		templateFields.length === requiredFields.length &&
		requiredFields.every((field) => templateFields.includes(field))
	)
};

export const fieldConfig = {
	date: {
		type: "date",
		placeholder: "Date",
		validate: isValidDate,
		errorMessage: "Please enter a valid date.",
	},
	image: {
		type: "text",
		placeholder: "Image",
		validate: isValidImageURL,
		errorMessage: "Invalid image URL (jpg, jpeg, png).",
	},
	signature_name: {
		type: "text",
		placeholder: "Signature",
		validate: isString,
		errorMessage: "Invalid Signature",
	},
	student_name: {
		type: "text",
		placeholder: "Student",
		validate: isString,
		errorMessage: "Invalid Name",
	},
	subject: {
		type: "text",
		placeholder: "Subject",
		validate: isString,
		errorMessage: "Invalid Subject",
	},
};