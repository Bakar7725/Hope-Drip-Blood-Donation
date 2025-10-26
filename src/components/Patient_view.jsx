import Card from '../components/cardGrid'
import FilterBar from './FilterBar';
function Patient()
{
    return(
        <>
        <div className="min-h-screen ">
            <div>
                <FilterBar />
            </div>
            <div className='min-h-screen'>
                <Card />
            </div>
        </div>
        </>
    );
}
export default Patient