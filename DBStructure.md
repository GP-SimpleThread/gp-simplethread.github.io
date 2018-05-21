## Database Structure

```JavaScript
{
	users: {
		!SYSTEM: {},
		
		/** @type {User} */
		!SYSTEM_INFO: {
			name: "",
			bio: "",
			photo: ""
		},

		/** @type {User} */
		xxxxxxxx: {
			name: String,
			bio: String,
			photo: URL.toString(),

			/** @type {Array<Link>} */
			links: [
				{ title: String, url: URL.toString() },
				...
			]
		},

		...
	},

	threads: [
		"!SYSTEM",

		/** @type {Thread} */
		{
			name: String,
			overview: String,
			details: String,
			password: null | String,
			createdAt: Date.getTime(),

			/** @type {Array<Status>} */
			statuses: [
				{
					user: "!SYSTEM_INFO",
					status: $self.overview
				},

				{ user: String(UID), status: String },
				...
			],

			admins: [
				String(UID),
				...
			]
		},

		...
	]
}
```