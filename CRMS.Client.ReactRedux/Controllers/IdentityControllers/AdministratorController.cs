
using CRMS.Client.ReactRedux.DB;
using CRMS.Client.ReactRedux.Frame.EmailService;
using CRMS.Client.ReactRedux.Models;
using CRMS.Client.ReactRedux.Models.Dtos;
using CRMS.Client.ReactRedux.Models.IdentityModels;
using CRMS.Client.ReactRedux.Services.ConfigurationServices;
using CRMS.Client.ReactRedux.Services.EmailServices;
using CRMS.Client.ReactRedux.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace CRMS.Client.ReactRedux.Controllers.IdentityControllers
{
    // Class ============= || Administrator - Controller ||==========================================
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]
    [ApiController]
    public class AdministratorController : ControllerBase
    {
        
        private readonly RoleManager<IdentityRole> roleManager; // RoleManager
        private readonly UserManager<ApplicationUser> userManager; // User Manager
        private readonly IdentityContext _identityDBContext; // Db Context
        private readonly ItlCrmsDbContext _itlCrmsDbContext;
        private readonly IHostApplicationLifetime  appLifetime;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly IAppsettingsConfigurationService _appsettingsConfigurationService;


        // || Constructor || ====================================================================
        public AdministratorController(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager,
            IdentityContext identityDBContext, ItlCrmsDbContext itlCrmsDbContext, IHostApplicationLifetime appLifetime,
            IConfiguration configuration, IEmailService emailService, IAppsettingsConfigurationService appsettingsConfigurationService)
        {
            this.roleManager = roleManager;
            this.userManager = userManager;
            _identityDBContext = identityDBContext;
            _itlCrmsDbContext = itlCrmsDbContext;
            this.appLifetime = appLifetime;
            _configuration = configuration;
            _emailService = emailService;
            _appsettingsConfigurationService = appsettingsConfigurationService;
        }






        // ===== Send Email|| Post || =====================================================================
        [HttpPost]
        [Route("SendEmail")]
        public async Task<IActionResult> SendEmail(string receiverEmail, string subject, string content)
        {
           return await Task.Run(() =>
            {
                _emailService.SendRawMail(receiverEmail, subject, content);
                return StatusCode(200, "Email Sendt!");
            });
        }



        [HttpPost]
        [Route("SendNotificationMails")]
        public async Task<int> SendNotificationMails()
        {
             return await _emailService.SendToAllMails();
        }




        // SERVER RELEATED ######################################################################################################
        // ===== Restart Server || POST || =====================================================================
        [HttpGet]
        [Route("GetServerInfo")]
        public IActionResult GetServerInfo(IServer server)
        {
            var osVersion = Environment.OSVersion;
            var version = Environment.Version;
            var userName = Environment.UserName;
            var domain = Environment.UserDomainName;
            var machine = Environment.MachineName;
            var processorCount = Environment.ProcessorCount;
            var startedMlSeconds = Environment.TickCount;
            var memorry = Environment.WorkingSet;

            var obj = new
            {
                OsVersion = osVersion,
                Version = version,
                UserName = userName,
                Domain = domain,
                Machine = machine,
                ProcessorCount = processorCount,
                StartedMlSeconds = startedMlSeconds,
                MappedPhysicalMemorry = memorry
            };
            return StatusCode(200, obj);
        }






        // ===== Restart Server || POST || =====================================================================
        [HttpPost]
        [Route("RestartServer")]
        public IActionResult RestartServer()
        {
            _ = Task.Run(() =>
              {
                  Thread.Sleep(2000);
                  appLifetime.StopApplication();
              });
            return StatusCode(200, "Reastarting... Please wait...");
        }






        // Server Email #####################################################################################################################
        [HttpGet]
        [Route("GetServerEmailSettings")]
        public async Task<JsonElement> GetServerEmailSettings()
        {
           return await _appsettingsConfigurationService.GetServerEmailSettingsAsync();
        }

        

 

        // ===== Set Server Email Settings || POST || =====================================================================
        [HttpPut]
        [Route("SetServerEmailSettings")]
        public async Task<IActionResult> SetServerEmailSettings(EmailServiceConfig emailSettingsObj)
        {
            if(emailSettingsObj.ValidateAll())
            {  
               await _appsettingsConfigurationService.SetServerEmailSettingsAsync(emailSettingsObj);
                return StatusCode(200, await GetServerEmailSettings());
            }
            return StatusCode(400, "Invalid Input!");
        }



            



        // Notifications for ready subscription for invoicement ############################################################################################################
        // ===== Get Notification days before ready for Invoicement|| GET || =====================================================================
        [HttpGet]
        [Route("GetNotificationDays")]
        public async Task<IActionResult> GetNotificationDays()
        {   
              
            return StatusCode(200, new { daysBefore = await _appsettingsConfigurationService.GetNotificationDaysAsync()});
        }




        // ===== Set Notification days || POST || =====================================================================
        [HttpPut]
        [Route("SetNotificationDays")]
        public async Task<IActionResult> SetNotificationDays(int notificationDays)
        {
            if (notificationDays != 0)
            {
                await _appsettingsConfigurationService.SetNotificationDaysAsync(notificationDays);
                return StatusCode(200, await GetNotificationDays());
            }
            return StatusCode(409, "Forkeret Input! - Dage kan ikke være 0!");
        }






        // ConnectionString ######################################################################################################################
        // ===== Get DB Connectionstring || GET || =====================================================================
        [HttpGet]
        [Route("GetDbConString")]
        public async Task<IActionResult> GetDbConString()
        {   
            return StatusCode(200, new { conString = await _appsettingsConfigurationService.GetDbConStringAsync()});
        }



        

        // ===== Set DB Connectionstring || POST || =====================================================================
        [HttpPut]
        [Route("SetDbConString")]
        public async Task<IActionResult> SetDbConString(string conString)
        {    
            if (!string.IsNullOrWhiteSpace(conString))
            {
                await _appsettingsConfigurationService.SetDbConStringAsync(conString);
                return await GetDbConString();
            }
            return StatusCode(409, "Invalid Input!");
        }








        //// MAILS ######################################################################################################
        //// ===== Get Notification Mails || GET || =====================================================================
        //[HttpGet]
        //[Route("GetAllNotificationMails")]
        //public async Task<IEnumerable> GetAllNotificationMails()
        //{
        //    return await _itlCrmsDbContext.Set<NotificationMailsModel>().ToListAsync();
        //}





        //// ===== Add Notification Mail || POST || =====================================================================
        //[HttpPost]
        //[Route("AddNotificationMail")]
        //public async Task<IActionResult> AddNotificationMail(NotificationMailsModel email)
        //{
        //    if(!string.IsNullOrEmpty(email.Email))
        //    {   
        //       _itlCrmsDbContext.Set<NotificationMailsModel>().Add(email);
               
        //       // If Saved
        //       if (await _itlCrmsDbContext.SaveChangesAsync() > 0)
        //       {
        //           return StatusCode(200, await GetAllNotificationMails());
        //       }
               
        //       return StatusCode(500, "Save Failed!");
        //    }
        //    return StatusCode(400, "Empty Input");
        //}










        //// Delete - Notification Mail ------------------------------------------------------------------------------------------------------------------------------------------
        //[HttpDelete]
        //[Route("DeleteNotificationMailByEmail")]
        //public async Task<IActionResult> DeleteNotificationMailByEmail(string email)
        //{
        //    var email_exists = await _itlCrmsDbContext.NotificationMails.FirstOrDefaultAsync(m => m.Email == email);

        //    if (email_exists != null)
        //    {
        //        _itlCrmsDbContext.NotificationMails.Remove(email_exists);

        //        // If Save OK
        //        if (await _itlCrmsDbContext.SaveChangesAsync() > 0)
        //        {
        //            return StatusCode(200, await GetAllNotificationMails());
        //        }
        //        return StatusCode(500, $"Failed - to Delete the Email: {email_exists.Email}");
        //    }
        //    else
        //    {
        //        return StatusCode(404, "Email does not exists!");
        //    }
        //}







        // ===== Create Role || POST || =====================================================================
        [HttpPost]
        [Route("CreateRole")]
        public async Task<IActionResult> CreateRole(string roleName)
        {
            if (roleName != null)   // If not emopty input
            {
                IdentityRole identityRole = new IdentityRole { Name = roleName }; // Set New Role
                var result = await roleManager.CreateAsync(identityRole);

                if (result.Succeeded)// If OK
                {
                    return StatusCode(200, "[\n \"Role Created Successfully\" \n]");
                }
                return StatusCode(500, result.Errors.Select(e => e.Description));
            }
            return StatusCode(409, "[\n \"Input was null - Cant create Role without rolename\" \n]");
        }











        // ===== Get All Roles  || GET || =====================================================================
        [HttpGet]
        [Route("GetAllRoles")]
        public async Task<IActionResult> GetAllRoles()
        {
            return await Task.Run(() =>
            {
                var roles = roleManager.Roles;
                return new JsonResult(roles);
            });
        }












        // ===== Edit Role - || Post || =====================================================================
        [HttpPost]
        [Route("EditRole")]
        public async Task<IActionResult> EditRole(string oldName, string newName)
        {
            if (oldName != null && newName != null)  // If not emopty input
            {
                // Find Role
                var role = await roleManager.FindByNameAsync(oldName);
                if (role != null) // If found
                {
                    role.Name = newName; // Change Name
                    var result = await roleManager.UpdateAsync(role); // Update

                    if (result.Succeeded) // If Update OK
                    {
                        return StatusCode(200, "[\n \"Role Updated Successfully\" \n]");
                    }
                    return StatusCode(500, result.Errors.Select(e => e.Description));  // If Update Error
                }
                else // If no such Role
                {
                    return StatusCode(404, "[\n \"No such role\" \n]");
                }
            }
            return StatusCode(409, "[\n \"Empty input: Role - OldName or Role - New Name or both were empty\" \n]");
        }














        // ===== Remove Role And Reassign- || Post || =====================================================================
        [HttpPost]
        [Route("RemoveRoleAndReassign")]
        public async Task<IActionResult> RemoveRoleAndReassign(string roleName, string reAssignRole)
        {
            if (!string.IsNullOrWhiteSpace(roleName) && !string.IsNullOrWhiteSpace(reAssignRole)) // If not emopty input
            {
                var role = await roleManager.FindByNameAsync(roleName); // Find the role
                if (role != null) // If Role exists
                {
                    var usersInRole = await userManager.GetUsersInRoleAsync(roleName); // Get List of user in the Role

                    // Reassign Users to another role----------------------------------------------------------
                        var roleToReAssign = await roleManager.FindByNameAsync(reAssignRole); // Get the role for reassigning
                        if (roleToReAssign != null) // If reassigning role exists
                        {
                            List<ApplicationUser> rollbackList = new List<ApplicationUser>(); // Rollback list if erors
                            IdentityResult changeRoleResult;

                            for (int i = 0; i < usersInRole.Count; i++) // Loop and reassign users
                            {
                                changeRoleResult = await userManager.AddToRoleAsync(usersInRole[i], reAssignRole);
                            }
                        }
                        else
                        {
                            return StatusCode(404, $"[\n \"The Role: \"{reAssignRole}\" for reassigning the users cant be found\" \n]");
                        }
                    



                    // Delete the Role-----------------------------------------------------------------------
                    var result = await roleManager.DeleteAsync(role); // Delete Role
                    if (result.Succeeded) // If Ok
                    {
                        return StatusCode(200, $"[\n \"Role: \"{roleName} \" was Successfully Deleted\" \n]");  // Role Deleted msg
                    }
                    return StatusCode(500, result.Errors.Select(e => e.Description)); // Delete Errors

                }
                return StatusCode(401, "[\n \"Role not found\" \n]"); // Role not found msg
            }
            return StatusCode(409, "[\n \"Empty input: Rolename & ReAssignRole cant be empty\" \n]");

        }














        // ===== Remove Role - || Post || =====================================================================
        [HttpPost]
        [Route("RemoveRole")]
        public async Task<IActionResult> RemoveRole(string roleName)
        {
            if (!string.IsNullOrWhiteSpace(roleName)) // If not emopty input
            {
                var role = await roleManager.FindByNameAsync(roleName); // Find the role
                if (role != null)
                {
                    var result = await roleManager.DeleteAsync(role); // Delete Role
                    if (result.Succeeded) // If Ok
                    {
                        return StatusCode(200, $"[\n \"Role: \"{roleName} \" was Successfully Deleted\" \n]");  // Role Deleted msg
                    }
                    return StatusCode(500, result.Errors.Select(e => e.Description)); // Delete Errors
                } 
                return StatusCode(401, "[\n \"Role not found\" \n]"); // Role not found msg
            }
            return StatusCode(409, "[\n \"Empty input: Rolename cant be empty\" \n]");

        }














        // ===== Remove User from Role - || Post || =====================================================================
        [HttpDelete]
        [Route("RemoveUserFromRole")]
        public async Task<IActionResult> RemoveRoleFromUser(string email, string roleName)
        {
            if (!string.IsNullOrWhiteSpace(email) && !string.IsNullOrWhiteSpace(roleName)) // If Input not empty
            {
                var user = await userManager.FindByEmailAsync(email);  // Get User
                if (user != null) // If user found
                {
                    var role = await roleManager.FindByNameAsync(roleName); // Get Role
                    if (role != null) // If role found
                    {
                        var result = await userManager.RemoveFromRoleAsync(user, roleName); // Remove User from Role
                        if (result.Succeeded) // If Ok
                        {
                            return await GetAllUsersWithRoles();  
                            //return StatusCode(200, $"[\n \"User: \"{user.Email}\" was removed from Role: \" {roleName} \" \n]"); // Remove User from Role msg
                        }
                        return StatusCode(500, result.Errors.Select(e => e.Description)); // If Remove User from role error
                    }
                    return StatusCode(404, "[\n \"No such Role\" \n]"); // If Role not found msg
                }
                return StatusCode(404, "[\n \"No such User\" \n]"); // If User not found msg
            }
            return StatusCode(409, "[\n \"Empty input: Email or RoleName cant be empty\" \n]");
        }










        // Get user Roles ========================================================================== 
        [HttpGet]
        [Route("GetUserRoles")]
        public async Task<object> GetUserRoles(string email)
        {
            var user = await userManager.FindByEmailAsync(email); // Get User
            var userRoles = await userManager.GetRolesAsync(user);
            return new { UserEmail = user.Email, Roles = userRoles };
        }







        // ===== Add User To Role || Put || =====================================================================
        [HttpPut]
        [Route("AddUserToRole")]
        public async Task<IActionResult> AddUserToRole(string userEmail, string roleName)
        {
            if (!string.IsNullOrWhiteSpace(userEmail) && !string.IsNullOrWhiteSpace(roleName))  // If Input not empty
            {
                var user = await userManager.FindByEmailAsync(userEmail); // Find user
                if (user != null)
                {
                    var role = await roleManager.FindByNameAsync(roleName); // Find role
                    if (role != null)
                    {
                        if (!await userManager.IsInRoleAsync(user, roleName)) // If user is not in that role
                        {
                            var result = await userManager.AddToRoleAsync(user, roleName);  // Add the user to the ROLE
                            if (result.Succeeded)
                            {
                                return await GetAllUsersWithRoles();
                                //return StatusCode(200, $"[\n \"The user was Successfully added to the Role: - \"{roleName}\" \n]");
                            }
                            return StatusCode(500, result.Errors.Select(e => e.Description));
                        }
                        return StatusCode(409, "[\n \"The User is already member of that role\" \n]"); // Already memeber of that role msg
                    }
                    return StatusCode(404, "[\n \"Role not found\" \n]");  // Role not found
                }
                return StatusCode(404, "[\n \"User not found\" \n]"); // User not found
            }

            return StatusCode(409, "[\n \"Empty input: Email or RoleName cant be empty\" \n]");
        }










        // USERS ######################################################################################################
        // Register ========================================================================== 
        [HttpPost]
        [Route("RegisterUser")]
        public async Task<IActionResult> RegisterUser(string firstname, string lastname, string email, string age, string phonenumber, string password)
        {
            if (!string.IsNullOrWhiteSpace(email) && password != null)
            {
                //var user = new ApplicationUser { UserName = email, Email = email };  // Create the User
                var user = new ApplicationUser(); // Create the User
                var setResult = user.SetUserData(firstname, lastname, email, age, phonenumber, password);

                if (setResult.Succeeded) // If all validated
                {
                    var result = await userManager.CreateAsync(user); // Save the  User
                    if (result.Succeeded)  // If All Ok
                    {
                        return await GetAllUsersWithRoles();
                        //return StatusCode(201, "[\n \"Registration Successfull\" \n]");
                    }
                    return StatusCode(409, result.Errors.Select(e => e.Description));  // Create User - Errors
                }
                return StatusCode(409, setResult.Errors.Select(e => e.Description));  // Validation Errors
            }
            return StatusCode(400, "Email or/and password cant be empty!");  // Validation Errors

        }





        // ===== Get ALL Users - || GET || =====================================================================
        [HttpGet]
        [Route("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await userManager.Users.ToListAsync();
                return StatusCode(200, users); // Get all users
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }












        // ===== Get User - || GET || =====================================================================
        [HttpGet]
        [Route("GetUser")]
        public async Task<IActionResult> GetUser(string email)
        {
            if (!string.IsNullOrWhiteSpace(email))
            {
                var user = await userManager.FindByEmailAsync(email);
                if (user != null)
                {
                    return StatusCode(200, user); // Get user
                }
                return StatusCode(404, "No such user"); // No Such user error
            }

            return StatusCode(422, "[\n \"Email cant be empty \n]");  // If Email is null Error
        }







        //// ===== Get Users with Roles - || GET || =====================================================================
        //[HttpGet]
        //[Route("GetAllUsersWithRoles")]
        //public async Task<IActionResult> GetAllUsersWithRoles()
        //{
        //    try
        //    {
        //        return await Task.Run(() =>
        //        {
        //            var users = _identityDBContext.UserRoles;
        //            return StatusCode(200, users); // Get all users
        //        });
        //    }
        //    catch (Exception e)
        //    {
        //        return StatusCode(500, e);
        //    }
        //}








        // ===== Get Users with Roles - || GET || =====================================================================
        [HttpGet]
        [Route("GetAllUsersWithRoles")]
        public async Task<IActionResult> GetAllUsersWithRoles()
        {
            string query = "SELECT r.Name as roleName, ur.roleId, u.id as userId, u.FirstName, u.LastName, u.Age, u.Email, u.PhoneNumber, u.SecurityStamp, u.ConcurrencyStamp FROM dbo.AspNetUserRoles AS ur FULL JOIN dbo.AspNetUsers AS u ON ur.UserId = u.Id FULL JOIN dbo.AspNetRoles AS r ON ur.RoleId = r.Id";
            bool added;
            try
            {
                List<UsersWithRolesDto> usersWithRoles = new List<UsersWithRolesDto>();
                using (var command = _identityDBContext.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandText = query;
                    command.CommandType = CommandType.Text;

                    await _identityDBContext.Database.OpenConnectionAsync();

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {     
                                added = false;
                                for (int i = 0; i < usersWithRoles.Count; i++)  // If User is already added add Roles to the user
                                {

                                    // Check 
                                    var userRoleFromDb = "";
                                    if(await reader.IsDBNullAsync("UserId") == false)
                                    {
                                        userRoleFromDb = reader.GetFieldValueAsync<string>("UserId").Result;
                                    }
                                    else
                                    {
                                        userRoleFromDb = "";
                                    }

                                // #
                                    if ((usersWithRoles[i].UserId == userRoleFromDb) && !await reader.IsDBNullAsync("RoleId") && !await reader.IsDBNullAsync("RoleName"))
                                    {
                                        usersWithRoles[i].Roles.Add(new Role
                                        {
                                            RoleId = await reader.IsDBNullAsync("RoleId") == true ? "" : reader.GetFieldValueAsync<string>("RoleId").Result,
                                            RoleName = await reader.IsDBNullAsync("RoleName") == true ? "" : reader.GetFieldValueAsync<string>("RoleName").Result
                                        
                                        });
                                        added = true;
                                        break;
                                    }
                                }
                          
                            if (added == false && await reader.IsDBNullAsync("UserId") == false) // If user is not added add user with the set of roles - if there are more roles they will be added from the for loop above
                            {      
                                UsersWithRolesDto obj = new UsersWithRolesDto
                                {
                                    //Roles RoleName = reader.GetFieldValueAsync<string>("RoleName").Result,
                                    //RoleId = reader.GetFieldValueAsync<string>("RoleId").Result,
                                    UserId = await reader.IsDBNullAsync("UserId") ? "" : reader.GetFieldValueAsync<string>("UserId").Result,   
                                    FirstName = await reader.IsDBNullAsync("FirstName") ? "" : reader.GetFieldValueAsync<string>("FirstName").Result,  
                                    LastName = await reader.IsDBNullAsync("LastName") ? "" : reader.GetFieldValueAsync<string>("LastName").Result,
                                    //Age = await reader.IsDBNullAsync("Age") == true ? 0 : reader.GetFieldValueAsync<int>("Age").Result,  
                                    Email = await reader.IsDBNullAsync("Email") == true ? "" : reader.GetFieldValueAsync<string>("Email").Result, 
                                    PhoneNumber = await reader.IsDBNullAsync("PhoneNumber") ? "" : reader.GetFieldValueAsync<string>("PhoneNumber").Result,
                                    SecurityStamp = await reader.IsDBNullAsync("SecurityStamp") == true ? "" : reader.GetFieldValueAsync<string>("SecurityStamp").Result,
                                    ConcurrencyStamp = await reader.IsDBNullAsync("ConcurrencyStamp") == true ? "" : reader.GetFieldValueAsync<string>("ConcurrencyStamp").Result
                                };    
                                  obj.Roles.Add(new Role { 
                                      RoleId = await reader.IsDBNullAsync("RoleId") == true ? "" : reader.GetFieldValueAsync<string>("RoleId").Result, 
                                      RoleName = await reader.IsDBNullAsync("RoleName") == true ? "" : reader.GetFieldValueAsync<string>("RoleName").Result 
                                  });
                                  usersWithRoles.Add(obj);    
                            }
                        }
                    }
                }
                return StatusCode(200, usersWithRoles); // Get all users   
            }
            catch (Exception e)
            {
                return StatusCode(500, e);
            }
        }







        //// ===== Get Users with Roles - || GET || =====================================================================
        //[HttpGet]
        //[Route("GetAllUsersWithRoles")]
        //public async Task<IActionResult> GetAllUsersWithRoles()
        //{
        //    string query = "SELECT r.Name as roleName, ur.roleId, u.Id as userId   FROM dbo.AspNetUserRoles AS ur INNER JOIN dbo.AspNetUsers AS u ON ur.UserId = u.Id INNER JOIN dbo.AspNetRoles AS r ON ur.RoleId = r.Id";
        //    try
        //    {
        //        ICollection<object> usersWithRoles = new List<object>();
        //        using (var command = _identityDBContext.Database.GetDbConnection().CreateCommand())
        //        {
        //            command.CommandText = query;
        //            command.CommandType = CommandType.Text;

        //            await _identityDBContext.Database.OpenConnectionAsync();

        //            using (var reader = await command.ExecuteReaderAsync())
        //            {      
        //                while (await reader.ReadAsync())
        //                {
        //                    usersWithRoles.Add(new { 
        //                        roleName = reader.GetFieldValueAsync<string>(0).Result, 
        //                        roleId = reader.GetFieldValueAsync<string>(1).Result,
        //                        userId = reader.GetFieldValueAsync<string>(2).Result
        //                    });
        //                }    
        //            }
        //        }
        //            return StatusCode(200, usersWithRoles); // Get all users   
        //    }
        //    catch (Exception e)
        //    {
        //        return StatusCode(500, e);
        //    }
        //}







        // Update User ==================================================================================
        [HttpPut]
        [Route("UpdateUserById")]
        public async Task<IActionResult> UpdateUserById(string firstName, string lastName, string userId, string email, string age, string phonenumber, string password)
        {
            // Get User by email
            var user = await _identityDBContext.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user != null)
            {
                // Set User data with validation    
                var validationResult = user.SetUserData(firstName, lastName, email, age, phonenumber, password);


                // Update
                if (validationResult.Succeeded) // Update if validation passed
                {
                    var result = await userManager.UpdateAsync(user);
                    if (result.Succeeded)// If OK
                    {
                        return await GetAllUsersWithRoles();
                    }
                    else  // If Update Error
                    {
                        return StatusCode(409, result.Errors.Select(e => e.Description));
                    }
                }
                else // If validation Error
                {
                    return StatusCode(409, validationResult.Errors.Select(e => e.Description));
                }
            }
            return StatusCode(409, "No such user");
        }





        // Update User ==================================================================================
        [HttpPut]
        [Route("UpdateUserByEmail")]
        public async Task<IActionResult> UpdateUserByEmail(string firstName, string lastName, string currentEmail , string newEmail, string age, string phonenumber, string password)
        {
            // Get User by email
            var user = await _identityDBContext.Users.FirstOrDefaultAsync(u => u.Email == currentEmail);

             if(user != null)
             {
                 // Set User data with validation    
                 var validationResult = user.SetUserData(firstName, lastName, newEmail, age, phonenumber, password);
                 
                 
                 // Update
                 if (validationResult.Succeeded) // Update if validation passed
                 {
                     var result = await userManager.UpdateAsync(user);
                     if (result.Succeeded)// If OK
                     {
                         return StatusCode(200, new { User = await userManager.FindByEmailAsync(newEmail ??= currentEmail), Users = await userManager.Users.ToListAsync()});
                     }
                     else  // If Update Error
                     {
                         return StatusCode(409, result.Errors.Select(e => e.Description));
                     }
                 }
                 else // If validation Error
                 {
                     return StatusCode(409, validationResult.Errors.Select(e => e.Description));
                 }
             }
            return StatusCode(409, "No such user");
        }









        // ===== Delete User - || Post || =====================================================================
        [HttpDelete]
        [Route("DeleteUser")]
        public async Task<IActionResult> DeleteUser(string email)
        {
            var currentUser = await userManager.GetUserAsync(HttpContext.User); // Current User
            if(currentUser.Email == email)
            {
                return StatusCode(409, "Admin - kan ikke slette sig selv, men en anden Admin kan slette Admin!");
            }


            if (!string.IsNullOrWhiteSpace(email))
            {
                // Get User by Email
                var user = await userManager.FindByEmailAsync(email);

                if (user != null)
                {
                    // Delete the User
                    var result = await userManager.DeleteAsync(user);


                    if (result.Succeeded)// If Success
                    {
                        return await GetAllUsersWithRoles();   // Return Users and Users with roles
                    }
                    else// If Error
                    {
                        return new JsonResult(result.Errors.Select(e => e.Description));
                    }
                }
                else// If no such user
                {
                    return StatusCode(422, "[\n \"No such user\" \n]");
                }
            }

            return StatusCode(422, "[\n \"Email cant be empty \n]");

        }
    }
}
