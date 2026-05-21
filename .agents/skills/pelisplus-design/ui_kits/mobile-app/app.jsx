// Mobile app — stage that lays out the four screens side by side
function MStage() {
  return (
    <div className="m-stage">
      <div className="m-stage-head">
        <h1>PelisPlus · App</h1>
        <p>Cuatro pantallas. Cuatro toques. Toda la programación en el bolsillo.</p>
      </div>
      <div className="m-row">
        <div className="m-phone-wrap">
          <Phone initialTab="home"/>
          <div className="m-phone-caption">Cartelera</div>
        </div>
        <div className="m-phone-wrap">
          <Phone initialTab="tickets"/>
          <div className="m-phone-caption">Tickets</div>
        </div>
        <div className="m-phone-wrap">
          <Phone initialTab="plus"/>
          <div className="m-phone-caption">PelisPlus Club</div>
        </div>
        <div className="m-phone-wrap">
          <Phone initialTab="me"/>
          <div className="m-phone-caption">Cuenta</div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<MStage/>);
