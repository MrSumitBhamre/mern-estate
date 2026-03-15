
const express = require('express');
const router = express.Router();

const controller = require('../../controllers/property.controller');
const auth = require('../../middlewares/auth.middleware');
const role = require('../../middlewares/role.middleware');
const validate = require('../../middlewares/validate.middleware');
const { createPropertySchema } = require('../../validations/property.validation');

router.post(
    '/',
    auth,
    role(2, 1), // AGENT, ADMIN
    validate(createPropertySchema),
    controller.create
);

router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.delete);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

module.exports = router;
