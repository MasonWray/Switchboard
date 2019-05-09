<?php
    $ffprobe = 'E:\Personal\Git\Switchboard\cli\ext\ffmpeg\ffprobe.exe';
    $ffmpeg = 'E:\Personal\Git\Switchboard\cli\ext\ffmpeg\ffmpeg.exe';
    $sample = 'E:\Personal\fftest\sample.mkv';
    $output = 'E:\Personal\fftest\out.vob';
    $command = "$ffmpeg -i $sample -map 0:4 $output";
    // print("$ffmpeg and some stuff \n");
    system($command);
?>