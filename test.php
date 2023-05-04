<!DOCTYPE html>
<html>
  <head>
    
  </head>
  <body>
    <h1>Test php</h1>
    <p>
		<?php
		if (isset($_GET['name'])) {
			$t = $_GET['writenText'];
		}
		else {
			$t = "NIC NIE WPISAŁEŚ";
		}
		echo $t;
		?>
	</p>
    <form action="test.php" method="get">
      <input type="text" name="writenText">
      <input type="submit">
    </form>
  </body>
</html>
