const RoleModel = require("../models/RoleModel");

// create a role
const createRole = async (req, res) => {

      try {
            const { role, hasPermission } = req.body;

            const filter = {
                  role
            }

            const isRoleExist = Boolean(await RoleModel.findOne(filter))

            if (isRoleExist) {
                  return res.status(409).send({
                        status: false,
                        message: `Role exist with ${role}`
                  })
            }

            else {
                  const newRole = await RoleModel.create(
                        {
                              role,
                              hasPermission
                        }
                  )

                  res.status(201).send(
                        {
                              status: true,
                              message: "Role created successfully",
                              data: newRole
                        }
                  )
            }
      } catch (err) {
            res.status(500).send(
                  {
                        status: false,
                        message: `Error in creating role: ${err}`
                  })
      }
}

// get all roles
const roles = async (req, res) => {

      try {
            await search(req, res, '')

      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
};

const search = async (req, res, status) => {

      let filter = {
            isDeleted: false,
            status
      };

      if (status === '') {
            filter = {
                  isDeleted: false
            }
      }

      if (req.query.filterBy && req.query.value) {
            filter[req.query.filterBy] = req.query.value;
      }

      const pageSize = +req.query.pageSize || 10;
      const currentPage = +req.query.currentPage || 1;
      const sortBy = req.query.sortBy || '_id'; // _id or description or code or po or etc.
      const sortOrder = req.query.sortOrder || 'desc'; // asc or desc

      const totalItems = await RoleModel.find(filter).countDocuments();
      const items = await RoleModel.find(filter)
            .skip((pageSize * (currentPage - 1)))
            .limit(pageSize)
            .sort({ [sortBy]: sortOrder })
            .exec();

      const responseObject = {
            status: true,
            items,
            totalPages: Math.ceil(totalItems / pageSize),
            totalItems
      };

      if (items.length) {
            return res.status(200).json(responseObject);
      }

      else {
            return res.status(401).json({
                  status: false,
                  message: "Nothing found",
                  items
            });
      }
}

// update role
const updateRole = async (req, res) => {
      try {
            const { role, permission, isDeleted } = req.body;

            const filter = {
                  role
            }

            const roleExist = await RoleModel.findOne(filter)

            if (roleExist === null) {
                  return res.status(404).send(
                        {
                              status: false,
                              message: "Role not found"
                        }
                  );
            }

            else {
                  roleExist.hasPermission = permission ? permission : roleExist.hasPermission
                  roleExist.updatedAt = new Date()
                  roleExist.isDeleted = isDeleted ? isDeleted : false
                  
                  await roleExist.save();

                  await res.status(201).send(
                        {
                              status: true,
                              message: "Role updated successfully",
                              role: roleExist
                        });
            }
      } catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
};

module.exports = {
      createRole,
      roles,
      updateRole
}