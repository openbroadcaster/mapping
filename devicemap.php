  public function getGeoJSON()
  {

    $this->user->require_authenticated();

    $devices = $this->DevicesModel('get_geoJSON');

    if($devices)
    {

      return array(true,'devices',$devices;
    }

    else return array(false,'Device not found.');

  }
