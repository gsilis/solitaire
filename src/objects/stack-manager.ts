import { PointerButton, PointerEvent } from "excalibur";
import { CardAnchor } from "./card-anchor";
import { CardObject } from "./card-object";

export class StackManager {
  private temporaryStack: CardAnchor
  private stacks: CardAnchor[] = []
  private cards: CardObject[] = []
  private isDown: boolean = false
  private targetedCard: CardObject | null = null
  private startingStack: CardAnchor | null = null
  private targetStacks: CardAnchor[] = []
  private orphanedStackTimeout: ReturnType<typeof setTimeout> | null = null

  constructor(temporaryStack: CardAnchor) {
    this.temporaryStack = temporaryStack
  }

  addStack(stack: CardAnchor) {
    this.stacks.push(stack)
    stack.on('pointerdown', (event) => this.onStackInteractionStart(stack, event))
    stack.on('pointerup', (event) => this.onStackInteractionEnd(stack, event))
  }

  addTargetStack(stack: CardAnchor) {
    this.targetStacks.push(stack)
  }

  addCard(card: CardObject) {
    this.cards.push(card)
    card.on('pointerdown', (event) => this.onCardInteractionStart(card, event))
    card.on('pointerup', (event) => this.onCardInteractionEnd(card, event))
  }

  private onStackInteractionStart = (stack: CardAnchor,  event: PointerEvent) => {
    if (!stack.mouseEvents) return

    this.isDown = true
    this.startingStack = stack
    this.targetedCard = null
  }

  private onStackInteractionEnd = (stack: CardAnchor, event: PointerEvent) => {
    this.isDown = false

    if (this.orphanedStackTimeout) {
      clearTimeout(this.orphanedStackTimeout)
      this.orphanedStackTimeout = null
    }

    const firstCardInStack = this.temporaryStack.firstCard as CardObject

    if (stack.acceptCard(firstCardInStack)) {
      this.sendTreeToStack(stack)

      const lastCard = this.startingStack?.lastCard as CardObject
      if (lastCard?.isHidden) {
        lastCard.flip()
      }

      this.updateStackEnabled()
    } else if (this.startingStack) {
      const wouldAccept = this.targetedCard && this.acceptableTargetForCard(this.targetedCard)

      if (wouldAccept && !this.targetedCard?.next) {
        this.sendTreeToStack(wouldAccept)
        const lastCard = this.startingStack?.lastCard as CardObject
        if (lastCard?.isHidden) {
          lastCard.flip()
        }

        this.updateStackEnabled()
      } else {
        this.sendTreeToStack(this.startingStack)
      }
    }
  }

  private onCardInteractionStart = (card: CardObject, event: PointerEvent) => {
    // All cards under the pointer will be reported here
    // Excalibur appears to process these based on z-index?
    const isHidden = card.isHidden

    if (this.isDown && !this.targetedCard && !isHidden) {
      this.targetedCard = card

      if (event.button === PointerButton.Left) {
        this.dragCardTree()
      }
    }
  }

  private onCardInteractionEnd = (card: CardObject, event: PointerEvent) => {
    if (this.orphanedStackTimeout) return

    this.orphanedStackTimeout = setTimeout(() => {
      // If this runs, then no pointerup event triggered on another stack
      const wouldAccept = this.acceptableTargetForCard(card)

      if (!card.next && wouldAccept) {
        this.sendTreeToStack(wouldAccept)
        this.updateStackEnabled()
      } else if (this.startingStack) {
        this.sendTreeToStack(this.startingStack)
      }
      
      this.orphanedStackTimeout = null
      this.startingStack = null
      this.targetedCard = null
    }, 70)
  }

  private dragCardTree = () => {
    if (!this.targetedCard || !this.startingStack) return

    const cardTree = this.targetedCard.tree()
    const detachedCards = this.startingStack.detach(cardTree.length)

    detachedCards.forEach(card => {
      this.temporaryStack.attach(card)
    })
  }

  private sendTreeToStack(stack: CardAnchor) {
    const tempCards = this.temporaryStack.tree()
    const detachedCards = this.temporaryStack.detach(tempCards.length)

    detachedCards.forEach((card) => {
      stack.attach(card)
    })
  }

  private updateStackEnabled() {
    this.stacks.forEach((stack) => {
      if (stack.enabledIfBlank) {
        stack.mouseEvents = !stack.enabledIfBlank.lastCard
      }
    })
  }

  private acceptableTargetForCard(card: CardObject): CardAnchor | undefined {
    let anchor: CardAnchor | undefined = undefined
    this.targetStacks.forEach((stack: CardAnchor) => {
      if (stack.acceptCard(card)) {
        anchor = stack
      }
    })

    return anchor
  }
}