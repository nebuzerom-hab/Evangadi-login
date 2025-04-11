import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import profileService from "../services/profileService";
import { appState } from "../App";

const ChangePassword = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { token } = useContext(appState);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("New password is required"),
  });

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await profileService.changePassword(values, token);
        setSuccess(true);
        setError("");
        formik.resetForm();
        setTimeout(() => navigate("/profile"), 1500);
      } catch (err) {
        setError(err.response?.data?.msg || "Password change failed");
        setSuccess(false);
      }
    },
  });

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Change Password
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && (
          <Alert severity="success">Password changed successfully!</Alert>
        )}
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Current Password"
            name="currentPassword"
            type="password"
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
            error={
              formik.touched.currentPassword &&
              Boolean(formik.errors.currentPassword)
            }
            helperText={
              formik.touched.currentPassword && formik.errors.currentPassword
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="New Password"
            name="newPassword"
            type="password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            error={
              formik.touched.newPassword && Boolean(formik.errors.newPassword)
            }
            helperText={formik.touched.newPassword && formik.errors.newPassword}
          />
          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={formik.isSubmitting}
            >
              Change Password
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/profile")}
              sx={{
                "&:hover": {
                  color: "orange",
                  borderColor: "red",
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default ChangePassword;

// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const ChangePassword = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     watch,
//     reset,
//   } = useForm();
//   const [serverError, setServerError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const navigate = useNavigate();

//   const onSubmit = async (data) => {
//     setServerError("");
//     setSuccessMessage("");

//     try {
//       const response = await axios.put("/api/users/change-password", data, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       setSuccessMessage(response.data.msg);
//       reset();
//       // Optionally redirect after successful password change
//       navigate("/profile");
//     } catch (error) {
//       if (error.response) {
//         if (error.response.data.errors) {
//           // Validation errors are already handled by react-hook-form
//           return;
//         }
//         setServerError(error.response.data.msg || "Password change failed");
//       } else {
//         setServerError("Network error. Please try again.");
//       }
//     }
//   };

//   return (
//     <div className="change-password-container">
//       <h2>Change Password</h2>
//       {serverError && <div className="alert alert-danger">{serverError}</div>}
//       {successMessage && (
//         <div className="alert alert-success">{successMessage}</div>
//       )}

//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="form-group">
//           <label htmlFor="currentPassword">Current Password</label>
//           <input
//             type="password"
//             id="currentPassword"
//             className={`form-control ${
//               errors.currentPassword ? "is-invalid" : ""
//             }`}
//             {...register("currentPassword", {
//               required: "Current password is required",
//             })}
//           />
//           {errors.currentPassword && (
//             <div className="invalid-feedback">
//               {errors.currentPassword.message}
//             </div>
//           )}
//         </div>

//         <div className="form-group">
//           <label htmlFor="newPassword">New Password</label>
//           <input
//             type="password"
//             id="newPassword"
//             className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
//             {...register("newPassword", {
//               required: "New password is required",
//               minLength: {
//                 value: 8,
//                 message: "Password must be at least 8 characters",
//               },
//               validate: (value) => {
//                 if (value === watch("currentPassword")) {
//                   return "New password must be different from current password";
//                 }

//                 // Frontend validation to match backend rules
//                 const hasUpperCase = /[A-Z]/.test(value);
//                 const hasLowerCase = /[a-z]/.test(value);
//                 const hasNumber = /[0-9]/.test(value);
//                 const hasSpecialChar = /[^A-Za-z0-9]/.test(value);

//                 let message = "";
//                 if (!hasUpperCase) message += "At least one uppercase letter. ";
//                 if (!hasLowerCase) message += "At least one lowercase letter. ";
//                 if (!hasNumber) message += "At least one number. ";
//                 if (!hasSpecialChar)
//                   message += "At least one special character.";

//                 return message === "" || message;
//               },
//             })}
//           />
//           {errors.newPassword && (
//             <div className="invalid-feedback">
//               {typeof errors.newPassword.message === "string"
//                 ? errors.newPassword.message
//                 : "Password must contain: uppercase, lowercase, number, and special character"}
//             </div>
//           )}
//           <small className="form-text text-muted">
//             Password must contain at least 8 characters, including uppercase,
//             lowercase, number, and special character.
//           </small>
//         </div>

//         <div className="form-group">
//           <label htmlFor="confirmNewPassword">Confirm New Password</label>
//           <input
//             type="password"
//             id="confirmNewPassword"
//             className={`form-control ${
//               errors.confirmNewPassword ? "is-invalid" : ""
//             }`}
//             {...register("confirmNewPassword", {
//               validate: (value) =>
//                 value === watch("newPassword") || "Passwords do not match",
//             })}
//           />
//           {errors.confirmNewPassword && (
//             <div className="invalid-feedback">
//               {errors.confirmNewPassword.message}
//             </div>
//           )}
//         </div>

//         <button type="submit" className="btn btn-primary">
//           Change Password
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ChangePassword;
