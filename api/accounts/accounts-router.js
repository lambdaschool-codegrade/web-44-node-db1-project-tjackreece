const router = require("express").Router();

const Accounts = require("./accounts-model");

const {
	checkAccountId,
	checkAccountPayload,
	checkAccountNameUnique,
} = require("./accounts-middleware");

router.get("/", async (req, res, next) => {
	try {
		const accounts = await Accounts.getAll();
		res.status(200).json(accounts);
	} catch (err) {
		next(err);
	}
});

router.get("/:id", checkAccountId, async (req, res, next) => {
	if (req.account) {
		res.status(200).json(req.account);
	} else {
		next({ message: "Could not fetch account." });
	}
});

router.post(
	"/",
	checkAccountPayload,
	checkAccountNameUnique,
	async (req, res, next) => {
		const { name, budget } = req.body;
		const accountToUse = {
			name: name.trim(),
			budget: budget,
		};
		try {
			const account = await Accounts.create(accountToUse);
			res.status(201).json(account);
		} catch (err) {
			next(err);
		}
	}
);

router.put(
	"/:id",
	checkAccountId,
	checkAccountPayload,
	async (req, res, next) => {
		try {
			const { id } = req.params;
			const { name, budget } = req.body;
			const accountToUse = {
				name: name.trim(),
				budget: budget,
			};
			const account = await Accounts.updateById(id, accountToUse);
			res.status(200).json(account);
		} catch (err) {
			next(err);
		}
	}
);

router.delete("/:id", checkAccountId, async (req, res, next) => {
	try {
		const { id } = req.params;
		const accountToDel = await Accounts.deleteById(id);
		res.status(200).json(accountToDel);
	} catch (err) {
		next(err);
	}
});

router.use((err, req, res, next) => {
	res.status(err.status || 500).json({ message: err.message });
});

module.exports = router;
