<?php 
ob_start();
session_start(); //start the user session as enter the page
if(empty($_SESSION['name']))
{
	header('Location: log.php');
	/* Make sure that code below does not get executed when we redirect. */
	exit;
}

?>
<!DOCTYPE html>
<html>

<?php 

	
	include('header.php');
?>



<body style="width: 1330px; margin-left:auto; margin-right: auto;">
	<div class="container-fluid ">
    	<div class="row-fluid">
        	<div class="col-lg-6 col-md-6	col-sm-6" style="yellow">
            	<button type="button" class="btn btn-default btn-md" data-toggle="modal" data-target="#help">
                	<span class="glyphicon glyphicon-question-sign "></span> Help [F1]
                </button>
                <button type="button" class="btn btn-default btn-md" data-toggle="modal" data-target="#setting">
                	<span class="glyphicon glyphicon-cog"></span> Activity Setting's [F2]
                </button>
                <button type="button" class="btn btn-default btn-md" data-toggle="modal" data-target="#help2">
                	<span class="glyphicon glyphicon-question-sign "></span> Help [F1] (altalternative)
                </button>
                
            </div>
            <div class="col-lg-6 col-md-6 col-sm-6 right" style="red">
           		 
                
            	<button type="button" class="btn btn-default btn-md">
                	<span class="glyphicon glyphicon-user "></span> Hello, <?php echo $_SESSION['name'];?>
                </button>
                <button type="button" class="btn btn-default btn-md" onClick="?signout">
                	<span class="glyphicon glyphicon-log-out"></span> Sign Out [Ctrl + Esc]
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
        		<div class="list-group">
                	<a href="#" class="list-group-item">Afrikaans</a>
                    <a href="#" class="list-group-item">AfrikaansII</a>
                    <a href="#" class="list-group-item">AfrikaansIII</a>
                </div>
            </div>
        </div>
    </div>
    <!-- setting box -->
    <div class="modal fade" id="setting" tabindex="-1" role="dialog" aria-labelledby="setting" aria-hidden="true">
        <div class="modal-dialog">
        	<form>
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="setting"><span class="glyphicon glyphicon-cog"></span> Activity Setting's</h4>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                            <label for="topActivityText">Top Selected Activity: Text</label><br>
                            <input type="radio" name="topActivityText" value="on" checked> On (default)<br>
                            <input type="radio" name="topActivityText" value="off"> Off<br>
                            <input type="radio" name="topActivityText" value="answerBox"> Answer-box<br>
                     </div>
                     <div class="form-group">
                            <label for="topActivityAudio">Top Selected Activity: Audio</label><br>
                            <input type="radio" name="topActivityAudio" value="on" checked> On (default)<br>
                            <input type="radio" name="topActivityAudio" value="off"> Off<br>
                            <input type="radio" name="topActivityAudio" value="answerBox"> Answer-box<br>
                     </div>
                     <div class="form-group">
                            <label for="middleActivityImage">Middle Selected Activity: Image</label><br>
                            <input type="radio" name="middleActivityImage" value="on" checked> On (default)<br>
                            <input type="radio" name="middleActivityImage" value="off"> Off<br>
                     </div>
                     <div class="form-group">
                            <label for="bottomActivityText">Bottom Selected Activity: Text</label><br>
                            <input type="radio" name="bottomActivityText" value="on" checked> On (default)<br>
                            <input type="radio" name="bottomActivityText" value="off"> Off<br>
                            <input type="radio" name="bottomActivityText" value="answerBox"> Answer-box<br>
                     </div>
                     <div class="form-group">
                            <label for="bottomActivityAudio">Bottom Selected Activity: Audio</label><br>
                            <input type="radio" name="bottomActivityAudio" value="on" checked> On (default)<br>
                            <input type="radio" name="bottomActivityAudio" value="off"> Off<br>
                            <input type="radio" name="bottomActivityAudio" value="answerBox"> Answer-box<br>
                     </div>
                     <div class="form-group">
                            <label for="voiceDelay">Voice Delay</label><br>
                            <input type="range" id="betweenAudioSpeed" name="betweenAudioSpeed" min="1" max="4" step="1" value="2" onchange="cardsSingletonClass().updateTextInput(this, this.value);">
                            <input type="text" disabled="disabled" value="2" maxlength="1" id="betweenAudioSpeedOutput" class="outputValue">
                     </div>
                </div>
                <div class="modal-footer">
                	 <input type="submit" class="btn btn-primary" data-dismiss="modal" value="Save &amp; Close">
                </div>
            </div>
            </form>
        </div>
    </div> 
	<!-- setting box end-->
    <!-- Help Box box -->
    <div class="modal fade" id="help" tabindex="-1" role="dialog" aria-labelledby="help" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="help"><span class="glyphicon glyphicon-question-sign "></span> Help [F1]</h4>
                </div>
                <div class="modal-body">
                    <table class="table table-striped">
                    	<tr>
                        	<td>Ctrl + key</td>
                            <td>Action</td>
                        </tr>
                        <tr>
                        	<td><strong>+a</strong></td>
                            <td>Audio or Visual Mode</td>
                        </tr>
                        <tr>
                        	<td><strong>+q</strong></td>
                            <td>Audio Sitemap</td>
                        </tr>
                        <tr>
                        	<td><strong>+e</strong></td>
                            <td>Advanceed User Tips</td>
                        </tr>
                        <tr>
                        	<td><strong>+x</strong></td>
                            <td>Delete the Card</td>
                        </tr>
                        <tr>
                        	<td><strong>+c</strong></td>
                            <td># Cards To Go</td>
                        </tr>
                        <tr>
                        	<td><strong>+z (toggle)</strong></td>
                            <td>Card Feed on/off</td>
                        </tr>
                        <tr>
                        	<td><strong>+1</strong></td>
                            <td>Card Feed Slower</td>
                        </tr>
                        <tr>
                        	<td><strong>+2</strong></td>
                            <td>Card Feed faster</td>
                        </tr>
                        <tr>
                        	<td><strong>+s</strong></td>
                            <td>Audio Top Repeat</td>
                        </tr>
                        <tr>
                        	<td><strong>+d</strong></td>
                            <td>Audio Bottom Repeat</td>
                        </tr>
                        <tr>
                        	<td><strong>+f (toggle)</strong></td>
                            <td>Audio Top on/off</td>
                        </tr>
                        <tr>
                        	<td><strong>+g (toggle)</strong></td>
                            <td>Audio Bottom on/off</td>
                        </tr>
                        <tr>
                        	<td><strong>+3</strong></td>
                            <td>Audio Play Up-Dn Slower</td>
                        </tr>
                        <tr>
                        	<td><strong>+4</strong></td>
                            <td>Audio Play Up-Dn Faster</td>
                        </tr>
                        <tr>
                        	<td><strong>+v (toggle)</strong></td>
                            <td>Text Top on/answer/off</td>
                        </tr>
                        <tr>
                        	<td><strong>+b (toggle)</strong></td>
                            <td>Text Bottom on/answer/off</td>
                        </tr>
                        <tr>
                        	<td><strong>+y (toggle)</strong></td>
                            <td>Audio Feedback on/off</td>
                        </tr>
                        <tr>
                        	<td><strong>+i (toggle)</strong></td>
                            <td>Images on/off</td>
                        </tr>
                        <tr>
                        	<td><strong>+r (toggle)</strong></td>
                            <td>Card Randomized</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div> 
	<!-- Help Box end-->
    <!-- Help Box 2 box -->
    <div class="modal fade" id="help2" tabindex="-1" role="dialog" aria-labelledby="help2" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="help2"><span class="glyphicon glyphicon-question-sign "></span> Help [F1]</h4>
                </div>
                <div class="modal-body">
                    <table class="table table-striped">
                    	<tr>
                        	<td><kbd>Ctrl</kbd> <strong>+</strong> <kbd>key</kbd></td>
                            <td>Action</td>
                        </tr>
                        <tr>
                        	<td><kbd>a</kbd></td>
                            <td>Audio or Visual Mode</td>
                        </tr>
                        <tr>
                        	<td><kbd>q</kbd></td>
                            <td>Audio Sitemap</td>
                        </tr>
                        <tr>
                        	<td><kbd>e</kbd></td>
                            <td>Advanceed User Tips</td>
                        </tr>
                        <tr>
                        	<td><kbd>x</kbd></td>
                            <td>Delete the Card</td>
                        </tr>
                        <tr>
                        	<td><kbd>c</kbd></td>
                            <td>Number of Cards To Go</td>
                        </tr>
                        <tr>
                        	<td><kbd>z</kbd> <strong> (toggle)</strong></td>
                            <td>Card Feed on/off</td>
                        </tr>
                        <tr>
                        	<td><kbd>1</kbd></td>
                            <td>Decrease Card Feed</td>
                        </tr>
                        <tr>
                        	<td><kbd>2</kbd></td>
                            <td>Increase Card Feed</td>
                        </tr>
                        <tr>
                        	<td><kbd>s</ksd></td>
                            <td>Repeat Audio Top </td>
                        </tr>
                        <tr>
                        	<td><kbd>d</kbd></td>
                            <td>Repeat Audio Bottom </td>
                        </tr>
                        <tr>
                        	<td><kbd>f</kbd> <strong> (toggle)</strong></td>
                            <td>Audio Top on/off</td>
                        </tr>
                        <tr>
                        	<td><kbd>g</kbd> <strong> (toggle)</strong></td>
                            <td>Audio Bottom on/off</td>
                        </tr>
                        <tr>
                        	<td><kbd>3</kbd></td></td>
                            <td>Decrease Audio Play From Up-Down </td>
                        </tr>
                        <tr>
                        	<td><kbd>4</kbd></td>
                            <td>Increase Audio Play From Up-Down </td>
                        </tr>
                        <tr>
                        	<td><kbd>v</kbd><strong> (toggle)</strong></td>
                            <td>Text Top on/answer/off</td>
                        </tr>
                        <tr>
                        	<td><kbd>b</kbd><strong> (toggle)</strong></td>
                            <td>Text Bottom on/answer/off</td>
                        </tr>
                        <tr>
                        	<td><kbd>y</kbd><strong> (toggle)</strong></td>
                            <td>Audio Feedback on/off</td>
                        </tr>
                        <tr>
                        	<td><kbd>i</kbd><strong> (toggle)</strong></td>
                            <td>Images on/off</td>
                        </tr>
                        <tr>
                        	<td><kbd>r</kbd><strong> (toggle)</strong></td>
                            <td>Randomized Cards</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div> 
	<!-- Help Box 2 end-->
</body>
</html>