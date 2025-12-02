`Eb
Xct
Juøwhq
Vmoxmk
Nlojs`
	.split("\n")
	.map((l, i) =>
		[...l].map(c => String.fromCharCode(c.charCodeAt(0) - i - 1))
			.join("")
	).join("").replace("õ", "y")

