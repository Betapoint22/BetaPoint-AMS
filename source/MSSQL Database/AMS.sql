/****** Object:  Database [betap]    Script Date: 14-06-2022 02:33:55 ******/
CREATE DATABASE [betap]  (EDITION = 'Basic', SERVICE_OBJECTIVE = 'Basic', MAXSIZE = 2 GB) WITH CATALOG_COLLATION = SQL_Latin1_General_CP1_CI_AS;
GO
ALTER DATABASE [betap] SET COMPATIBILITY_LEVEL = 150
GO
ALTER DATABASE [betap] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [betap] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [betap] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [betap] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [betap] SET ARITHABORT OFF 
GO
ALTER DATABASE [betap] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [betap] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [betap] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [betap] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [betap] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [betap] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [betap] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [betap] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [betap] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [betap] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [betap] SET READ_COMMITTED_SNAPSHOT ON 
GO
ALTER DATABASE [betap] SET  MULTI_USER 
GO
ALTER DATABASE [betap] SET ENCRYPTION ON
GO
ALTER DATABASE [betap] SET QUERY_STORE = ON
GO
ALTER DATABASE [betap] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
/****** Object:  User [asset_soul]    Script Date: 14-06-2022 02:33:56 ******/
CREATE USER [asset_soul] FOR LOGIN [asset_soul] WITH DEFAULT_SCHEMA=[dbo]
GO
sys.sp_addrolemember @rolename = N'db_owner', @membername = N'asset_soul'
GO
sys.sp_addrolemember @rolename = N'db_accessadmin', @membername = N'asset_soul'
GO
sys.sp_addrolemember @rolename = N'db_securityadmin', @membername = N'asset_soul'
GO
sys.sp_addrolemember @rolename = N'db_ddladmin', @membername = N'asset_soul'
GO
sys.sp_addrolemember @rolename = N'db_backupoperator', @membername = N'asset_soul'
GO
sys.sp_addrolemember @rolename = N'db_datareader', @membername = N'asset_soul'
GO
sys.sp_addrolemember @rolename = N'db_datawriter', @membername = N'asset_soul'
GO
sys.sp_addrolemember @rolename = N'db_denydatareader', @membername = N'asset_soul'
GO
sys.sp_addrolemember @rolename = N'db_denydatawriter', @membername = N'asset_soul'
GO
/****** Object:  Table [dbo].[Access_request]    Script Date: 14-06-2022 02:33:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Access_request](
	[serial] [int] IDENTITY(1,1) NOT NULL,
	[applicant_name] [varchar](255) NOT NULL,
	[applicant_id] [varchar](255) NOT NULL,
	[email] [varchar](255) NOT NULL,
	[date] [varchar](255) NOT NULL,
	[contact] [char](10) NULL,
	[Request_status] [varchar](255) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Activity]    Script Date: 14-06-2022 02:33:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Activity](
	[activity_id] [int] IDENTITY(1,1) NOT NULL,
	[approve_date] [varchar](255) NULL,
	[approve_time] [varchar](255) NULL,
	[emp_id] [varchar](255) NULL,
	[tag_id] [int] NOT NULL,
	[approve_status] [varchar](255) NULL,
	[movement_status] [varchar](255) NULL,
	[movement_time] [varchar](255) NULL,
	[reach_time] [varchar](255) NULL,
	[Activity_status] [varchar](50) NULL,
	[starting_point] [int] NULL,
	[destination] [int] NULL,
 CONSTRAINT [PK__Activity__482FBD636CBEC548] PRIMARY KEY CLUSTERED 
(
	[activity_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Alert]    Script Date: 14-06-2022 02:33:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Alert](
	[alert_id] [int] IDENTITY(1,1) NOT NULL,
	[reader_id] [int] NULL,
	[tag_id] [varchar](255) NULL,
	[location_name] [varchar](255) NULL,
	[alert_status] [varchar](255) NULL,
	[alert] [varchar](255) NULL,
	[room_name] [varchar](255) NULL,
	[date] [varchar](50) NULL,
	[time] [varchar](50) NULL,
	[alert_desc] [varchar](255) NULL,
	[location_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[alert_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[assets]    Script Date: 14-06-2022 02:33:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[assets](
	[asset_id] [varchar](255) NOT NULL,
	[asset_class] [varchar](255) NULL,
	[asset_grade] [varchar](255) NULL,
	[asset_type] [varchar](255) NULL,
	[asset_purpose] [varchar](255) NULL,
	[tag_id] [int] NULL,
	[asset_status] [varchar](255) NULL,
	[asset_price] [varchar](255) NULL,
	[room_name] [varchar](255) NULL,
	[asset_name] [varchar](255) NULL,
	[location_id] [int] NULL,
	[dept_id] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[department]    Script Date: 14-06-2022 02:33:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[department](
	[dept_id] [int] IDENTITY(1,1) NOT NULL,
	[dept_name] [varchar](255) NOT NULL,
	[dept_type] [varchar](255) NOT NULL,
	[location_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[dept_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[dept_name] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Employees]    Script Date: 14-06-2022 02:33:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Employees](
	[emp_no] [int] IDENTITY(1,1) NOT NULL,
	[first_name] [varchar](255) NULL,
	[middle_name] [varchar](255) NULL,
	[last_name] [varchar](255) NULL,
	[dept_work] [varchar](255) NULL,
	[contact_no] [char](10) NULL,
	[hire_date] [date] NULL,
	[job] [varchar](255) NULL,
	[ed_level] [varchar](255) NULL,
	[sex] [varchar](50) NULL,
	[DOB] [date] NULL,
	[emp_title] [varchar](255) NULL,
	[emp_salary] [int] NULL,
	[emp_commision] [varchar](255) NULL,
	[nationality] [varchar](50) NULL,
	[id_card_no] [varchar](255) NULL,
	[username] [varchar](255) NULL,
	[password] [varchar](255) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[History]    Script Date: 14-06-2022 02:33:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[History](
	[history_id] [int] IDENTITY(1,1) NOT NULL,
	[approve_date] [varchar](255) NULL,
	[approve_time] [varchar](255) NULL,
	[emp_id] [varchar](255) NULL,
	[starting_point] [int] NULL,
	[destination] [int] NULL,
	[tag_id] [int] NOT NULL,
	[approve_status] [varchar](255) NULL,
	[movement_status] [varchar](255) NULL,
	[movement_time] [varchar](255) NULL,
	[reach_time] [varchar](255) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[location]    Script Date: 14-06-2022 02:33:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[location](
	[location_id] [int] IDENTITY(13,71000) NOT NULL,
	[location_name] [varchar](255) NOT NULL,
	[location_type] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[location_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[location_name] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Logs]    Script Date: 14-06-2022 02:33:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Logs](
	[log_id] [int] IDENTITY(1,1) NOT NULL,
	[tag_uuid] [varchar](255) NOT NULL,
	[date] [varchar](255) NULL,
	[time] [varchar](255) NULL,
	[reader_id] [int] NULL,
	[location_id] [int] NULL,
	[room_id] [int] NULL,
	[approve_status] [varchar](255) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Movement_request]    Script Date: 14-06-2022 02:33:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Movement_request](
	[serial] [int] IDENTITY(1,1) NOT NULL,
	[asset_id] [varchar](255) NULL,
	[date] [varchar](255) NULL,
	[time] [varchar](255) NULL,
	[custodian_name] [varchar](255) NULL,
	[custodian_id] [varchar](255) NULL,
	[requester_name] [varchar](255) NULL,
	[requester_id] [varchar](255) NULL,
	[Request_status] [varchar](255) NULL,
	[starting_point] [varchar](255) NULL,
	[destination] [varchar](255) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Performance]    Script Date: 14-06-2022 02:33:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Performance](
	[GPU_consumption] [int] NOT NULL,
	[Wifi_consumption] [int] NOT NULL,
	[Tasks] [int] NOT NULL,
	[Thread] [int] NOT NULL,
	[running_thread] [int] NOT NULL,
	[Average_load] [varchar](255) NOT NULL,
	[Uptime] [varchar](50) NULL,
	[Memory] [int] NOT NULL,
	[CPU] [int] NOT NULL,
	[CPU_usage] [int] NOT NULL,
	[LAN_consumption] [int] NOT NULL,
	[WAN_consumption] [int] NOT NULL,
	[CPU_temp] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[reader]    Script Date: 14-06-2022 02:33:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[reader](
	[reader_id] [int] IDENTITY(1,678568) NOT NULL,
	[reader_name] [varchar](255) NULL,
	[reader_serial] [varchar](255) NULL,
	[reader_type] [varchar](255) NULL,
	[room_name] [varchar](255) NULL,
	[reader_status] [varchar](255) NULL,
	[reader_IP] [varchar](50) NULL,
	[dept_id] [int] NULL,
	[location_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[reader_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[rooms]    Script Date: 14-06-2022 02:33:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[rooms](
	[room_id] [int] IDENTITY(100,565678) NOT NULL,
	[room_name] [varchar](255) NULL,
	[room_reader_count] [int] NOT NULL,
	[room_reader_type] [varchar](255) NULL,
	[room_lat] [int] NULL,
	[room_long] [int] NULL,
	[location_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[room_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[room_name] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Session]    Script Date: 14-06-2022 02:33:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Session](
	[users] [varchar](255) NULL,
	[start_time] [time](7) NULL,
	[end_time] [time](7) NULL,
	[session_status] [varchar](50) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tags]    Script Date: 14-06-2022 02:33:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tags](
	[tag_id] [int] IDENTITY(326,1238769) NOT NULL,
	[tag_type] [varchar](255) NULL,
	[tag_name] [varchar](255) NULL,
	[tag_range] [varchar](255) NULL,
	[tag_uuid] [varchar](255) NOT NULL,
	[tag_status] [varchar](255) NULL,
	[dept_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[tag_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 14-06-2022 02:33:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[user_id] [varchar](255) NOT NULL,
	[user_name] [varchar](255) NOT NULL,
	[email] [varchar](255) NOT NULL,
	[password] [varchar](255) NOT NULL,
	[user_type] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[user_id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Access_request] ADD  DEFAULT ('Pending') FOR [Request_status]
GO
ALTER TABLE [dbo].[Activity] ADD  CONSTRAINT [DF__Activity__approv__69FBBC1F]  DEFAULT ('False') FOR [approve_status]
GO
ALTER TABLE [dbo].[Activity] ADD  CONSTRAINT [DF__Activity__moveme__6AEFE058]  DEFAULT ('False') FOR [movement_status]
GO
ALTER TABLE [dbo].[Activity] ADD  CONSTRAINT [DF__Activity__Activi__43D61337]  DEFAULT ('STATIC') FOR [Activity_status]
GO
ALTER TABLE [dbo].[History] ADD  CONSTRAINT [DF__History__approve__0880433F]  DEFAULT ('approved') FOR [approve_status]
GO
ALTER TABLE [dbo].[Movement_request] ADD  DEFAULT ('Pending') FOR [Request_status]
GO
ALTER TABLE [dbo].[Activity]  WITH CHECK ADD FOREIGN KEY([destination])
REFERENCES [dbo].[location] ([location_id])
GO
ALTER TABLE [dbo].[Activity]  WITH CHECK ADD FOREIGN KEY([starting_point])
REFERENCES [dbo].[location] ([location_id])
GO
ALTER TABLE [dbo].[Activity]  WITH CHECK ADD  CONSTRAINT [FK__Activity__tag_id__681373AD] FOREIGN KEY([tag_id])
REFERENCES [dbo].[tags] ([tag_id])
GO
ALTER TABLE [dbo].[Activity] CHECK CONSTRAINT [FK__Activity__tag_id__681373AD]
GO
ALTER TABLE [dbo].[Alert]  WITH CHECK ADD FOREIGN KEY([location_id])
REFERENCES [dbo].[location] ([location_id])
GO
ALTER TABLE [dbo].[Alert]  WITH CHECK ADD FOREIGN KEY([location_name])
REFERENCES [dbo].[location] ([location_name])
GO
ALTER TABLE [dbo].[Alert]  WITH CHECK ADD FOREIGN KEY([reader_id])
REFERENCES [dbo].[reader] ([reader_id])
GO
ALTER TABLE [dbo].[assets]  WITH CHECK ADD FOREIGN KEY([dept_id])
REFERENCES [dbo].[department] ([dept_id])
GO
ALTER TABLE [dbo].[assets]  WITH CHECK ADD FOREIGN KEY([location_id])
REFERENCES [dbo].[location] ([location_id])
GO
ALTER TABLE [dbo].[assets]  WITH NOCHECK ADD FOREIGN KEY([room_name])
REFERENCES [dbo].[rooms] ([room_name])
GO
ALTER TABLE [dbo].[assets]  WITH NOCHECK ADD FOREIGN KEY([tag_id])
REFERENCES [dbo].[tags] ([tag_id])
GO
ALTER TABLE [dbo].[department]  WITH CHECK ADD FOREIGN KEY([location_id])
REFERENCES [dbo].[location] ([location_id])
GO
ALTER TABLE [dbo].[Employees]  WITH CHECK ADD FOREIGN KEY([dept_work])
REFERENCES [dbo].[department] ([dept_name])
GO
ALTER TABLE [dbo].[Movement_request]  WITH CHECK ADD FOREIGN KEY([destination])
REFERENCES [dbo].[location] ([location_name])
GO
ALTER TABLE [dbo].[Movement_request]  WITH CHECK ADD FOREIGN KEY([starting_point])
REFERENCES [dbo].[location] ([location_name])
GO
ALTER TABLE [dbo].[reader]  WITH CHECK ADD FOREIGN KEY([dept_id])
REFERENCES [dbo].[department] ([dept_id])
GO
ALTER TABLE [dbo].[reader]  WITH CHECK ADD FOREIGN KEY([location_id])
REFERENCES [dbo].[location] ([location_id])
GO
ALTER TABLE [dbo].[rooms]  WITH CHECK ADD FOREIGN KEY([location_id])
REFERENCES [dbo].[location] ([location_id])
GO
ALTER TABLE [dbo].[rooms]  WITH CHECK ADD FOREIGN KEY([location_id])
REFERENCES [dbo].[location] ([location_id])
GO
ALTER TABLE [dbo].[tags]  WITH CHECK ADD FOREIGN KEY([dept_id])
REFERENCES [dbo].[department] ([dept_id])
GO
/****** Object:  StoredProcedure [dbo].[spGetDetails]    Script Date: 14-06-2022 02:33:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spGetDetails]
@tag_id INT
AS
BEGIN 
select asset_id,starting_point,destination,tag_uuid,tags.tag_id,approve_status,movement_status,approve_time,movement_time,reach_time,room_id,room_name,location.location_name,location_id
from Activity
INNER JOIN assets ON assets.tag_id=Activity.tag_id
INNER JOIN tags ON tags.tag_id=assets.tag_id
INNER JOIN  [location] ON [location].location_name=assets.location_name
where tags.tag_id= @tag_id
end
GO
ALTER DATABASE [betap] SET  READ_WRITE 
GO
