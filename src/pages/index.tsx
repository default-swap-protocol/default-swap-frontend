import { makeStyles } from '@material-ui/core/styles';
import dynamic from 'next/dynamic'
const Pools = dynamic(
  () => import('@components/Pools'),
  { ssr: false }
)

const Home = () => {
  return (
    <div>
      <Pools />
    </div>
  )
}

export default Home;