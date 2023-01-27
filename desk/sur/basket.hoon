|%
:: basket.
::  a db of images+metadata
::   anyone in your room has write access
::   frontend facilitates sharing.
:: ::
+$  metadata
  $:  
  tags=(set term)
  time=@da
  ==  
+$  images  (map cord metadata)
::
+$  action
  $%
    [%set-image image=cord meta=(unit metadata)]
    [%tag-image image=cord tag=term]
    [%untag-image image=cord tag=term]
    [%forget-image image=cord]
  ==
--
