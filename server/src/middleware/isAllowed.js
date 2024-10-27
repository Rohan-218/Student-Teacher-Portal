
exports.superAdmin = (req, res, next) => {
   const userType = req.user?.user_type;
   if (userType !== 0) {
       return res.status(403).json({ message: 'Access denied. Only super-admins can access this data.' });
   }
   next();
};

exports.admin = (req, res, next) => {
   const userType = req.user?.user_type;
   if (userType !== 0 && userType !== 3) {
       return res.status(403).json({ message: 'Access denied. Only admins can access this data.' });
   }
   next();
};

exports.teacher = (req, res, next) => {
   const userType = req.user?.user_type;
   if (userType !== 2) { 
       return res.status(403).json({ message: 'Unauthorized: Not a teacher' });
   }
   next();
};

exports.student = (req, res, next) => {
   const userType = req.user?.user_type;
   if (userType !== 1) {
       return res.status(403).json({ message: 'Unauthorized: Not a student' });
   }
   next();
};
