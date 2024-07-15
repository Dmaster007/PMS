import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NbCardModule } from '@nebular/theme';

@Component({
  selector: 'app-board-card',
  standalone: true,
  imports: [NbCardModule],
  templateUrl: './board-card.component.html',
  styleUrl: './board-card.component.css'
})
export class BoardCardComponent {
@Input() title = ''
@Input() content = ''
}
