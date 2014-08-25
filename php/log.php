<?php
ob_start(); 
session_start() //start the user session as enter the page?>
<!DOCTYPE html>
<html>

<?php 

	// this checks if the user has press the sign in button or not.
	if($_SERVER['REQUEST_METHOD'] == 'POST')
	{
		
		//galthering the User email and password
		$email = $_REQUEST['email'];
		$password = $_REQUEST['password'];
		
		/*
		 * checking both email and password if both contain
		 * a value and if not set to NULL to trigger user error!
		*/
		if(empty($email))
		{
			$email == NULL;
		}
		if(empty($password)) 
		{
			$password == NULL;
		}
		
		if($email != NULL && $password != NULL)
		{
			/*
			 * If both email and password not null then we will 
			 * connect to database to see if he/she a user inside the database table accounts
			*/
			include_once('connectdb.php');
			$q = 'SELECT * FROM accounts WHERE email="' . $email . '" AND password="' . $password . '"';
			$run = mysqli_query($dbc,$q);
			$num = mysqli_num_rows($run);
			
			if($num > 0)
			{
				//once match recode is found, we can store data in user session in super gobal SESSION[] 
				 
				while($data = mysqli_fetch_array($run))
				{
					$_SESSION['name'] = $data['firstName'] . " " . $data['lastName'];
					$_SESSION['user'] = $data['email'];
					header('Location: selectactivity.php');
					/* Make sure that code below does not get executed when we redirect. */
					exit;
				}
			}
			else
			{
				$serverError = "<p class='serverError'>Sorry!, That email address and password combination is incorrect.<br>Please try again</p>";
				$emailError = true;
				$passwordError = true;
			}
		}
		else
		{	
				
				if(empty($email))
				{
					$emailError = true;	
				}
				if(empty($password))
				{
					$passwordError = true;	
				}
		}
		
	}
	include('header.php');
?>



<body style="width: 1330px; margin-left:auto; margin-right: auto;">
	<div class="container-fluid ">
   		<div class="row-fluid">
        	<div class="col-lg-12 col-md-12	col-sm-12">
            	<button type="button" class="btn btn-default btn-md">
                	<span class="glyphicon glyphicon-question-sign "></span> Help [F1]
                </button>
                
            </div>
        </div>
        <div class="row-fluid">
        	<div class="col-lg-12 col-md-12 col-sm-12">
            <br>
            	<button type="button" class="btn btn-default btn-md">
                	<span class="glyphicon glyphicon-volume-off "></span> Enable Audio Mode [Ctrl + A]
                </button>
                <br>
            </div>
        </div>
        <div class="row-fluid">
        	<div class="col-lg-12 col-md-12 col-sm-12">
            <br>
            	<div class="formGroup">
                	<?php
						echo $serverError;
					?>
                	<form class="form" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" method="post">
                    	 <div class="form-group">
                            <label for="email" class="<?php if($_SERVER['REQUEST_METHOD'] == 'POST' && $emailError === true){echo "error";}?>">Email Address:</label>
                            <input type="email" class="form-control <?php if($_SERVER['REQUEST_METHOD'] == 'POST' && $emailError === true){echo "errorInput";}?>" id="email" name="email" placeholder="Email Address" value="<?php if(!empty($email)){echo $email;}?>">
                         </div>
                         
                         <div class="form-group">
                            <label for="password" class="<?php if($_SERVER['REQUEST_METHOD'] == 'POST' && $passwordError === true){echo "error";}?>">Password:</label>
                            <input type="password" class="form-control <?php if($_SERVER['REQUEST_METHOD'] == 'POST' && $passwordError === true){echo "errorInput";}?>" id="password" name="password" placeholder="Password" value="<?php if(!empty($password)){echo $password;}?>">
                         </div>
                         <br>
                         <input type="submit" class="btn btn-default" value="Log-in" >
                    </form> 
                </div>
            </div>
        </div>
    </div>
</body>
</html>