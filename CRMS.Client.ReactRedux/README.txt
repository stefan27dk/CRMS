
# ============= REDUX ==========================================================================================================================================================================================
Install Redux: - Install in the react folder "ClientApp" by using "cd ...myPath.."
NPM: npm install redux react-redux redux-thunk




# ============= EF CORE =========================================================================================================================================================================================

1. dotnet add package Microsoft.EntityFrameworkCore.SqlServer
2. dotnet add package Microsoft.EntityFrameworkCore.Design
3. dotnet tool install --global dotnet-ef
4.Install-Package Microsoft.EntityFrameworkCore.Tools 
5.Scaffold-DbContext "Data Source=DESKTOP-AIRSSU4\SQLEXPRESS;Initial Catalog=itlh_dk_db;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models -ContextDir  "DB" -Context "crmsDbContext" -DataAnnotations





# ============= EF CORE - Identity =========================================================================================================================================================================================
1. Add-Migration InitialIdentityMigration -Context IdentityContext -OutputDir Migrations\IdentityMigrations
2. update-database -Context IdentityContext -migration  InitialIdentityMigration 





    //"DefaultConnection": "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=ItlCrmsDb;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False"


































// Stefan B. Popov - 30-11-2021